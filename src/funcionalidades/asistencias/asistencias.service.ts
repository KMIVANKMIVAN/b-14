import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioService } from 'src/administracion/usuario/usuario.service';
import { handleExceptions } from 'src/utils/handleExceptions';
import { DatosAsistencia } from './asistencia.interface';
import { Asistencia } from '@prisma/client';

@Injectable()
export class AsistenciasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usuarioService: UsuarioService,
  ) {}

  async create(
    createAsistenciaDto: CreateAsistenciaDto,
  ): Promise<any> {
    try {
      const existeUsuario = await this.usuarioService.findOne(
        createAsistenciaDto.id_usuario,
      );

      // Actualizar los IDs en el DTO
      createAsistenciaDto.id_usuario = existeUsuario.id;

      // Crear el nuevo registro en la base de datos
      const nuevaAsistencia = await this.prisma.asistencia.create({
        data: createAsistenciaDto,
      });

      // Retornar el nuevo registro con la información adicional de la parada
      return {
        ...nuevaAsistencia,
      };
    } catch (error) {
      handleExceptions(error, 'create');
    }
  }

  async findAll(): Promise<Asistencia[]> {
    try {
      const hojarutas = await this.prisma.asistencia.findMany();
      if (!hojarutas || hojarutas.length === 0) {
        throw new NotFoundException({
          message: `No se encontraron Asistenciaes`,
        });
      }
      return hojarutas;
    } catch (error) {
      handleExceptions(error, 'findAll');
    }
  }

  async findOne(id: number): Promise<Asistencia> {
    try {
      const hojaruta = await this.prisma.asistencia.findUnique({
        where: { id },
      });
      if (!hojaruta) {
        throw new NotFoundException({
          message: `Asistencia con id ${id} no encontrado`,
        });
      }
      return hojaruta;
    } catch (error) {
      handleExceptions(error, 'findOne');
    }
  }

  async update(
    id: number,
    updateAsistenciaDto: UpdateAsistenciaDto,
  ): Promise<Asistencia> {
    try {
      const existeAsistencia = await this.findOne(id);

      return this.prisma.asistencia.update({
        where: { id },
        data: updateAsistenciaDto,
      });
    } catch (error) {
      handleExceptions(error, 'update');
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const existeAsistencia = await this.findOne(id);

      return this.prisma.asistencia.delete({
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
  ): Promise<DatosAsistencia[]> {
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
      const marcarParadas = await this.prisma.asistencia.findMany({
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
      const datosTransformados = marcarParadas.map((asistencia) => ({
        id: asistencia.id,
        fecha_registro: asistencia.fecha_registro.toISOString(),
        nombres: asistencia.usuario.nombres,
        apellidos: asistencia.usuario.apellidos,
        ci: asistencia.usuario.ci,
        placa: asistencia.usuario.placa,
        propietario: asistencia.usuario.propietario ? 'Si' : 'No',
        grupo: asistencia.usuario.grupo.grupo,
        nro: asistencia.usuario.grupo.nro,
      }));

      return datosTransformados;
    } catch (error) {
      handleExceptions(error, 'findAllPorFecha');
    }
  }
}
