import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Rol, Usuario } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolService } from '../rol/rol.service';
import * as bcrypt from 'bcrypt';

import { handleExceptions } from 'src/utils/handleExceptions';
import { capitalizeTextos } from 'src/utils/capitalizeTextos';
import { convertirFechaHora } from 'src/utils/convertirFechaHora';

type UsuarioSinContrasenia = Omit<Usuario, 'contrasenia'>;
type UsuarioSinContraseniaConRegistrador = Omit<
  Usuario,
  'contrasenia' | 'id_registrador'
> & {
  registrador: string;
};

@Injectable()
export class UsuarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rolService: RolService,
  ) {}

  async create(
    idregistrador: number,
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<UsuarioSinContrasenia> {
    try {
      console.log('');
      // console.log("",);

      const existeCI = await this.prisma.usuario.findFirst({
        where: { ci: createUsuarioDto.ci },
      });
      if (existeCI) {
        throw new BadRequestException({
          message: 'El CI ya fue registrado.',
        });
      }
      const existeRoles = await this.rolService.findOne(
        createUsuarioDto.id_rol,
      );

      createUsuarioDto.placa = createUsuarioDto.placa.toUpperCase();
      createUsuarioDto.ci = createUsuarioDto.ci.toUpperCase();

      createUsuarioDto.nombres = capitalizeTextos(createUsuarioDto.nombres);
      createUsuarioDto.apellidos = capitalizeTextos(createUsuarioDto.apellidos);
      createUsuarioDto.id_registrador = idregistrador;

      // Encriptar la contraseña
      const hashedContrasenia = await bcrypt.hash(createUsuarioDto.ci, 10);
      createUsuarioDto.contrasenia = hashedContrasenia;

      // Crear el usuario en la base de datos
      const usuario = await this.prisma.usuario.create({
        data: createUsuarioDto,
      });

      // Omitir la contraseña del objeto retornado
      const { contrasenia, ...usuarioSinContrasenia } = usuario;
      return usuarioSinContrasenia;
    } catch (error) {
      handleExceptions(error, 'create');
    }
  }
  async createSemilla(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const existeCI = await this.prisma.usuario.findFirst({
        where: { ci: createUsuarioDto.ci },
      });
      if (existeCI) {
        throw new BadRequestException({
          message: 'El CI ya fue registrado.',
        });
      }

      createUsuarioDto.nombres = capitalizeTextos(createUsuarioDto.nombres);
      createUsuarioDto.apellidos = capitalizeTextos(createUsuarioDto.apellidos);

      const existeRoles = await this.rolService.findOne(
        createUsuarioDto.id_rol,
      );

      // Encriptar la contraseña
      const hashedContrasenia = await bcrypt.hash(
        createUsuarioDto.contrasenia,
        10,
      );
      createUsuarioDto.contrasenia = hashedContrasenia;

      // Crear el usuario en la base de datos
      return await this.prisma.usuario.create({
        data: createUsuarioDto,
      });
    } catch (error) {
      // console.log('error', error);

      handleExceptions(error, 'createSemilla');
    }
  }

  async findAll(): Promise<UsuarioSinContrasenia[]> {
    try {
      const usuarios = await this.prisma.usuario.findMany({
        include: {
          rol: true, // Incluir la relación con `Rol`
          grupo: true,
        },
      });

      if (!usuarios || usuarios.length === 0) {
        throw new NotFoundException({
          message: `No se encontraron Usuarios`,
        });
      }

      // Omitir la contraseña de cada usuario en la lista
      return usuarios.map(
        ({ contrasenia, ...usuarioSinContrasenia }) => usuarioSinContrasenia,
      );
    } catch (error) {
      handleExceptions(error, 'findAll');
    }
  }
  async findOne(id: number): Promise<UsuarioSinContrasenia> {
    try {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id },
        include: {
          rol: true, // Incluir la relación con `Rol`
          grupo: true,
        },
      });
      if (!usuario) {
        throw new NotFoundException({
          message: `Usuario con id ${id} no encontrado`,
        });
      }

      const { contrasenia, ...usuarioSinContrasenia } = usuario;
      return usuarioSinContrasenia;
    } catch (error) {
      handleExceptions(error, 'findOne');
    }
  }
  async findOneCI(ci: string): Promise<Usuario & { rol: Rol }> {
    try {
      const usuario = await this.prisma.usuario.findFirst({
        where: { ci },
        include: {
          rol: true, // Incluir la relación con `Rol`
          grupo: true,
        },
      });
      if (!usuario) {
        throw new NotFoundException({
          message: `Usuario con CI ${ci} no encontrado`,
        });
      }

      return usuario;
    } catch (error) {
      handleExceptions(error, 'findOneCI');
    }
  }

  async findAllCI(ci: string): Promise<UsuarioSinContraseniaConRegistrador[]> {
    try {
      const usuarios = await this.prisma.usuario.findMany({
        where: {
          ci: {
            contains: ci, // Usar 'contains' para búsqueda tipo LIKE
            mode: 'insensitive', // Opcional: para búsqueda sin distinción entre mayúsculas y minúsculas
          },
        },
        include: {
          rol: true, // Incluir la relación con `Rol`
          grupo: true,
        },
      });

      if (!usuarios || usuarios.length === 0) {
        throw new NotFoundException({
          message: `Usuario con CI "${ci}" no encontrado`,
        });
      }

      // Obtener información del registrador para cada usuario
      const usuariosConRegistrador = await Promise.all(
        usuarios.map(
          async ({ contrasenia, id_registrador, ...usuarioSinContrasenia }) => {
            const registrador = await this.prisma.usuario.findUnique({
              where: { id: id_registrador },
            });

            return {
              ...usuarioSinContrasenia,
              registrador: registrador?.nombres || 'Desconocido',
            };
          },
        ),
      );

      return usuariosConRegistrador;
    } catch (error) {
      handleExceptions(error, 'findOneCI');
    }
  }

  async findAllCIPlaca(
    cioplaca: string,
  ): Promise<{ id: number; nombreCompleto: string }[]> {
    try {
      const usuarios = await this.prisma.usuario.findMany({
        where: {
          OR: [
            { ci: { contains: cioplaca, mode: 'insensitive' } }, // Búsqueda LIKE en `ci`
            { placa: { contains: cioplaca, mode: 'insensitive' } }, // Búsqueda LIKE en `placa`
          ],
        },
        select: {
          id: true,
          nombres: true,
          apellidos: true,
        },
      });

      if (!usuarios || usuarios.length === 0) {
        throw new NotFoundException({
          message: `No se encontraron usuarios con CI o Placa que contenga "${cioplaca}"`,
        });
      }

      // Combinar nombres y apellidos en un solo campo `nombreCompleto`
      return usuarios.map((usuario) => ({
        id: usuario.id,
        nombreCompleto: `${usuario.nombres} ${usuario.apellidos}`,
      }));
    } catch (error) {
      handleExceptions(error, 'findAllCIPlaca');
    }
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuarioSinContrasenia> {
    try {
      // console.log("",);
      const existeUsuario = await this.findOne(id);

      // Verificar si se envía 'nombres' o 'apellidos' para aplicar la capitalización
      if (updateUsuarioDto.nombres) {
        updateUsuarioDto.nombres = capitalizeTextos(updateUsuarioDto.nombres);
      }
      if (updateUsuarioDto.apellidos) {
        updateUsuarioDto.apellidos = capitalizeTextos(
          updateUsuarioDto.apellidos,
        );
      }

      // Verificar si se envía 'contrasenia' para aplicar el hash
      if (updateUsuarioDto.contrasenia) {
        const hashedContrasenia = await bcrypt.hash(
          updateUsuarioDto.contrasenia,
          10,
        );
        updateUsuarioDto.contrasenia = hashedContrasenia;
      }

      // Verificar si el rol existe antes de actualizar
      if (updateUsuarioDto.id_rol) {
        const existeRoles = await this.rolService.findOne(
          updateUsuarioDto.id_rol,
        );
      }

      const usuario = await this.prisma.usuario.update({
        where: { id },
        data: updateUsuarioDto,
      });

      const { contrasenia, ...usuarioSinContrasenia } = usuario;
      return usuarioSinContrasenia;
    } catch (error) {
      handleExceptions(error, 'update');
    }
  }
  async updatePw(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuarioSinContrasenia> {
    try {
      // console.log("",);
      const existeUsuario = await this.findOne(id);

      if (updateUsuarioDto.contrasenia) {
        const hashedContrasenia = await bcrypt.hash(
          updateUsuarioDto.contrasenia,
          10,
        );
        updateUsuarioDto.contrasenia = hashedContrasenia;
      }
      updateUsuarioDto.se_cambiado_cntr = true;
      const usuario = await this.prisma.usuario.update({
        where: { id },
        data: updateUsuarioDto,
      });

      const { contrasenia, ...usuarioSinContrasenia } = usuario;
      return usuarioSinContrasenia;
    } catch (error) {
      handleExceptions(error, 'updatePw');
    }
  }
  async updateResetearPw(id: number): Promise<UsuarioSinContrasenia> {
    try {
      const existeUsuario = await this.findOne(id);

      const hashedContrasenia = await bcrypt.hash(existeUsuario.ci, 10);

      const usuario = await this.prisma.usuario.update({
        where: { id },
        data: {
          contrasenia: hashedContrasenia,
          se_cambiado_cntr: false,
        },
      });

      const { contrasenia, ...usuarioSinContrasenia } = usuario;
      return usuarioSinContrasenia;
    } catch (error) {
      handleExceptions(error, 'updateResetearPw');
    }
  }
  async updateDarBaja(id: number): Promise<UsuarioSinContrasenia> {
    try {
      const existeUsuario = await this.findOne(id);

      const usuario = await this.prisma.usuario.update({
        where: { id },
        data: {
          es_activo: false,
        },
      });

      const { contrasenia, ...usuarioSinContrasenia } = usuario;
      return usuarioSinContrasenia;
    } catch (error) {
      handleExceptions(error, 'updateResetearPw');
    }
  }
  async updateDarAlta(id: number): Promise<UsuarioSinContrasenia> {
    try {
      const existeUsuario = await this.findOne(id);

      const usuario = await this.prisma.usuario.update({
        where: { id },
        data: {
          es_activo: true,
        },
      });

      const { contrasenia, ...usuarioSinContrasenia } = usuario;
      return usuarioSinContrasenia;
    } catch (error) {
      handleExceptions(error, 'updateResetearPw');
    }
  }

  async remove(id: number): Promise<UsuarioSinContrasenia> {
    try {
      const existeUsuario = await this.findOne(id);

      const usuario = await this.prisma.usuario.delete({
        where: { id },
      });

      const { contrasenia, ...usuarioSinContrasenia } = usuario;
      return usuarioSinContrasenia;
    } catch (error) {
      handleExceptions(error, 'remove');
    }
  }

  //funciones:
  async findOneParafindAllCI(id: number): Promise<UsuarioSinContrasenia> {
    try {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id },
      });
      if (!usuario) {
        throw new NotFoundException({
          message: `Usuario con id ${id} no encontrado`,
        });
      }

      const { contrasenia, ...usuarioSinContrasenia } = usuario;
      return usuarioSinContrasenia;
    } catch (error) {
      handleExceptions(error, 'findOne');
    }
  }
}
