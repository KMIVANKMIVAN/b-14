import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHojarutaDto } from './dto/create-hojaruta.dto';
import { UpdateHojarutaDto } from './dto/update-hojaruta.dto';
import { UsuarioService } from 'src/administracion/usuario/usuario.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleExceptions } from 'src/utils/handleExceptions';
import { HojaRuta } from '@prisma/client';
import { DatosHojaRuta } from './hoja-ruta.interface';

@Injectable()
export class HojarutasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usuarioService: UsuarioService,
  ) {}
  async create(
    idregistrador: number,
    createHojarutaDto: CreateHojarutaDto,
  ): Promise<any> {
    try {
      const existeUsuario = await this.usuarioService.findOne(
        createHojarutaDto.id_usuario,
      );

      // Actualizar los IDs en el DTO
      createHojarutaDto.id_usuario = existeUsuario.id;
      createHojarutaDto.id_registrador = idregistrador;

      // Crear el nuevo registro en la base de datos
      const nuevaHojaRuta = await this.prisma.hojaRuta.create({
        data: createHojarutaDto,
      });

      // Retornar el nuevo registro con la información adicional de la parada
      return {
        ...nuevaHojaRuta,
      };
    } catch (error) {
      handleExceptions(error, 'create');
    }
  }
  async createSemilla(createHojarutaDto: CreateHojarutaDto): Promise<any> {
    try {
      const existeUsuario = await this.usuarioService.findOne(
        createHojarutaDto.id_usuario,
      );

      // Actualizar los IDs en el DTO
      createHojarutaDto.id_usuario = existeUsuario.id;
      createHojarutaDto.id_registrador = createHojarutaDto.id_registrador;

      // Crear el nuevo registro en la base de datos
      const nuevaHojaRuta = await this.prisma.hojaRuta.create({
        data: createHojarutaDto,
      });

      // Retornar el nuevo registro con la información adicional de la parada
      return {
        ...nuevaHojaRuta,
      };
    } catch (error) {
      handleExceptions(error, 'createSemilla');
    }
  }

  async findAll(): Promise<HojaRuta[]> {
    try {
      const hojarutas = await this.prisma.hojaRuta.findMany();
      if (!hojarutas || hojarutas.length === 0) {
        throw new NotFoundException({
          message: `No se encontraron HojaRutaes`,
        });
      }
      return hojarutas;
    } catch (error) {
      handleExceptions(error, 'findAll');
    }
  }

  async findOne(id: number): Promise<HojaRuta> {
    try {
      const hojaruta = await this.prisma.hojaRuta.findUnique({
        where: { id },
      });
      if (!hojaruta) {
        throw new NotFoundException({
          message: `HojaRuta con id ${id} no encontrado`,
        });
      }
      return hojaruta;
    } catch (error) {
      handleExceptions(error, 'findOne');
    }
  }

  async update(
    id: number,
    updateHojarutaDto: UpdateHojarutaDto,
  ): Promise<HojaRuta> {
    try {
      const existeHojaRuta = await this.findOne(id);

      return this.prisma.hojaRuta.update({
        where: { id },
        data: updateHojarutaDto,
      });
    } catch (error) {
      handleExceptions(error, 'update');
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const existeHojaRuta = await this.findOne(id);

      return this.prisma.hojaRuta.delete({
        where: { id },
      });
    } catch (error) {
      handleExceptions(error, 'remove');
    }
  }

  //
  async findAllPorFecha(
    fechainicio: string,
    fechafin: string,
    idGrupo: number,
    cioplaca?: string, // Parám opcional
  ): Promise<DatosHojaRuta[]> {
    try {
      const inicioDate = new Date(fechainicio);
      const finDate = new Date(fechafin);
      finDate.setHours(23, 59, 59, 999);

      const whereClause: any = {
        fecha_registro: {
          gte: inicioDate,
          lte: finDate,
        },
        usuario: {
          id_grupo: idGrupo,
        },
      };

      if (cioplaca) {
        whereClause.usuario.OR = [
          { ci: { contains: cioplaca, mode: 'insensitive' } }, // Búsqueda con LIKE en `ci`
          { placa: { contains: cioplaca, mode: 'insensitive' } }, // Búsqueda con LIKE en `placa`
        ];
      }
      const marcarParadas = await this.prisma.hojaRuta.findMany({
        where: whereClause,
        include: {
          usuario: {
            include: {
              grupo: true,
            },
          },
        },
      });

      if (!marcarParadas || marcarParadas.length === 0) {
        throw new NotFoundException({
          message: `No se encontraron registros de hojas de ruta entre las fechas: "${fechainicio}" y "${fechafin}" para el grupo con ID: ${idGrupo}`,
        });
      }

      // Transformación de los datos
      const datosTransformados = marcarParadas.map((hojaRuta) => ({
        id: hojaRuta.id,
        monto: hojaRuta.monto,
        nombres: hojaRuta.usuario.nombres,
        apellidos: hojaRuta.usuario.apellidos,
        ci: hojaRuta.usuario.ci,
        placa: hojaRuta.usuario.placa,
        propietario: hojaRuta.usuario.propietario ? 'Si' : 'No',
        grupo: hojaRuta.usuario.grupo.grupo,
        nro: hojaRuta.usuario.grupo.nro,
        fecha_registro: hojaRuta.fecha_registro.toISOString(),
      }));

      return datosTransformados;
    } catch (error) {
      handleExceptions(error, 'findAllPorFecha');
    }
  }
}
