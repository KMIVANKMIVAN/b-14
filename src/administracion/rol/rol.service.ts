import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Rol } from '@prisma/client';
import { handleExceptions } from 'src/utils/handleExceptions';
import { capitalizeTextos } from 'src/utils/capitalizeTextos';

@Injectable()
export class RolService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createRolDto: CreateRolDto): Promise<Rol> {

    try {
      createRolDto.rol = capitalizeTextos(createRolDto.rol);

      const existeRol = await this.prisma.rol.findFirst({ where: { rol: createRolDto.rol } });
      if (existeRol) {
        throw new BadRequestException({
          message: 'El Rol ya fue registrado.',
        });
      }

      return this.prisma.rol.create({
        data: createRolDto,
      });

    } catch (error) {
      handleExceptions(error, 'create');

    }

  }

  async findAll(): Promise<Rol[]> {
    try {
      const roles = await this.prisma.rol.findMany();
      if (!roles || roles.length === 0) {
        throw new NotFoundException({
          message: `No se encontraron Roles`,
        });
      }
      return roles
    } catch (error) {
      handleExceptions(error, 'findAll');

    }
  }

  async findOne(id: number): Promise<Rol> {
    try {
      const rol = await this.prisma.rol.findUnique({
        where: { id },
      });
      if (!rol) {
        throw new NotFoundException({
          message: `Rol con id ${id} no encontrado`,
        });
      }
      return rol
    } catch (error) {
      handleExceptions(error, 'findOne');

    }
  }
  async findAllRoles(rol: string): Promise<Rol[]> {
    try {
      const roles = await this.prisma.rol.findMany({
        where: {
          rol: {
            contains: rol, // Usar 'contains' para búsqueda tipo LIKE
            mode: 'insensitive', // Opcional: para búsqueda sin distinción entre mayúsculas y minúsculas
          },
        },
      });

      if (!roles || roles.length === 0) {
        throw new NotFoundException({
          message: `Rol "${rol}" no encontrado`,
        });
      }

      return roles
    } catch (error) {
      handleExceptions(error, 'findAllRoles');
    }
  }


  async update(id: number, updateRolDto: UpdateRolDto): Promise<Rol> {
    try {
      const existeRol = await this.findOne(id);

      updateRolDto.rol = capitalizeTextos(updateRolDto.rol);

      return this.prisma.rol.update({
        where: { id },
        data: updateRolDto,
      });

    } catch (error) {

      handleExceptions(error, 'update');
    }
  }

  async remove(id: number): Promise<Rol> {
    try {
      const existeRol = await this.findOne(id);

      return this.prisma.rol.delete({
        where: { id },
      });
    } catch (error) {
      handleExceptions(error, 'remove');

    }
  }
}
