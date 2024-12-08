import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMarcarParadaDto } from './dto/create-marcarparada.dto';
import { UpdateMarcarParadaDto } from './dto/update-marcarparada.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MarcarParada } from '@prisma/client';
import { handleExceptions } from 'src/utils/handleExceptions';
import { capitalizeTextos } from 'src/utils/capitalizeTextos';
import { UsuarioService } from 'src/administracion/usuario/usuario.service';
import { DatosMarcarParada } from './datos-marcar-parada.interface';
import { ParadasService } from '../paradas/paradas.service';

@Injectable()
export class MarcarparadasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usuarioService: UsuarioService,
    private readonly paradasService: ParadasService,
  ) {}

  async findAllPorFecha(
    fechainicio: string,
    fechafin: string,
    idGrupo: number,
    cioplaca?: string, // Parám opcional
  ): Promise<DatosMarcarParada[]> {
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

      // Si `cioplaca` está presente, agregar la búsqueda en `ci` o `placa`
      /* if (cioplaca) {
        whereClause.usuario.OR = [
          { ci: cioplaca },   // Buscar en campo `ci`
          { placa: cioplaca } // Buscar en campo `placa`
        ];
      } */
      if (cioplaca) {
        whereClause.usuario.OR = [
          { ci: { contains: cioplaca, mode: 'insensitive' } }, // Búsqueda con LIKE en `ci`
          { placa: { contains: cioplaca, mode: 'insensitive' } }, // Búsqueda con LIKE en `placa`
        ];
      }
      const marcarParadas = await this.prisma.marcarParada.findMany({
        where: whereClause,
        include: {
          parada: true,
          usuario: {
            include: {
              grupo: true,
            },
          },
        },
      });

      if (!marcarParadas || marcarParadas.length === 0) {
        throw new NotFoundException({
          message: `No se encontraron registros de paradas entre las fechas: "${fechainicio}" y "${fechafin}" para el grupo con ID: ${idGrupo}`,
        });
      }

      // Transformación de los datos
      const datosTransformados = marcarParadas.map((marcarParada) => ({
        id: marcarParada.id,
        tipo: marcarParada.tipo,
        nombres: marcarParada.usuario.nombres,
        apellidos: marcarParada.usuario.apellidos,
        ci: marcarParada.usuario.ci,
        placa: marcarParada.usuario.placa,
        propietario: marcarParada.usuario.propietario ? 'Si' : 'No',
        grupo: marcarParada.usuario.grupo.grupo,
        nro: marcarParada.usuario.grupo.nro,
        fecha_registro: marcarParada.fecha_registro.toISOString(),
        parada: marcarParada.parada.parada,
        tipo_parada: marcarParada.parada.tipo,
      }));

      return datosTransformados;
    } catch (error) {
      handleExceptions(error, 'findAllPorFecha');
    }
  }

  async create(createMarcarParadaDto: CreateMarcarParadaDto): Promise<any> {
    try {
      // Capitalizar el tipo de parada
      createMarcarParadaDto.tipo = capitalizeTextos(createMarcarParadaDto.tipo);

      // Validar que el tipo solo puede ser "Inicio" o "Final"
      if (!['Inicio', 'Final'].includes(createMarcarParadaDto.tipo)) {
        throw new BadRequestException({
          message: `El tipo de marcar parada solo puede ser "Inicio" o "Final"`,
        });
      }

      // Verificar si existe el usuario y la parada
      const existeUsuario = await this.usuarioService.findOne(
        createMarcarParadaDto.id_usuario,
      );
      const existeParada = await this.paradasService.findOne(
        createMarcarParadaDto.id_parada,
      );

      // Verificar si ya existe un registro similar en los últimos 30 minutos
      const ahora = new Date();
      const treintaMinutosAntes = new Date(ahora.getTime() - 30 * 60 * 1000); // Hace 30 minutos

      const registroExistente = await this.prisma.marcarParada.findFirst({
        where: {
          id_usuario: createMarcarParadaDto.id_usuario,
          id_parada: createMarcarParadaDto.id_parada,
          tipo: createMarcarParadaDto.tipo,
          fecha_registro: {
            gte: treintaMinutosAntes, // Registro en los últimos 30 minutos
          },
        },
        include: {
          parada: true, // Incluir información de la parada para usarla en la excepción
        },
      });

      if (registroExistente) {
        throw new BadRequestException({
          message: `Ya existe un registro de tipo "${createMarcarParadaDto.tipo}" en la parada "${registroExistente.parada.parada}", YA SE REGISTRO SU LLEGADA A LA PARADA."${createMarcarParadaDto.id_usuario}"`,
        });
      }

      // Actualizar los IDs en el DTO
      createMarcarParadaDto.id_usuario = existeUsuario.id;
      createMarcarParadaDto.id_parada = existeParada.id;

      // Crear el nuevo registro en la base de datos
      const nuevaMarcarParada = await this.prisma.marcarParada.create({
        data: createMarcarParadaDto,
        include: {
          parada: true, // Incluir la parada en el retorno
        },
      });

      // Retornar el nuevo registro con la información adicional de la parada
      return {
        ...nuevaMarcarParada,
        parada: nuevaMarcarParada.parada.parada, // Nombre de la parada
        tipo_parada: nuevaMarcarParada.parada.tipo, // Tipo de la parada
      };
    } catch (error) {
      handleExceptions(error, 'create');
    }
  }

  async findAll(): Promise<MarcarParada[]> {
    try {
      const tipoes = await this.prisma.marcarParada.findMany({
        include: {
          parada: true,
          usuario: true,
        },
      });
      if (!tipoes || tipoes.length === 0) {
        throw new NotFoundException({
          message: `No se encontraron MarcarParadaes`,
        });
      }
      return tipoes;
    } catch (error) {
      handleExceptions(error, 'findAll');
    }
  }
  async findAllTransformados(): Promise<DatosMarcarParada[]> {
    try {
      const marcarParadas = await this.prisma.marcarParada.findMany({
        include: {
          parada: true,
          usuario: {
            include: {
              grupo: true, // Asegúrate de incluir el grupo si necesitas el nombre y número del grupo
            },
          },
        },
      });

      if (!marcarParadas || marcarParadas.length === 0) {
        throw new NotFoundException({
          message: `No se encontraron MarcarParadas`,
        });
      }

      // Mapeo de los datos a la estructura deseada
      const datosTransformados = marcarParadas.map((marcarParada) => ({
        id: marcarParada.id,
        tipo: marcarParada.tipo,
        nombres: marcarParada.usuario.nombres,
        apellidos: marcarParada.usuario.apellidos,
        ci: marcarParada.usuario.ci,
        placa: marcarParada.usuario.placa,
        propietario: marcarParada.usuario.propietario ? 'Si' : 'No',
        grupo: marcarParada.usuario.grupo.grupo, // Suponiendo que necesitas el nombre del grupo
        nro: marcarParada.usuario.grupo.nro, // Suponiendo que necesitas el número del grupo
        fecha_registro: marcarParada.fecha_registro.toISOString(), // Convierte a string

        parada: marcarParada.parada.parada, // Nombre de la parada
        tipo_parada: marcarParada.parada.tipo, // Tipo de la parada
      }));

      return datosTransformados;
    } catch (error) {
      handleExceptions(error, 'findAll');
    }
  }

  async findOne(id: number): Promise<MarcarParada> {
    try {
      const tipo = await this.prisma.marcarParada.findUnique({
        where: { id },
        include: {
          parada: true,
          usuario: true,
        },
      });
      if (!tipo) {
        throw new NotFoundException({
          message: `MarcarParada con id ${id} no encontrado`,
        });
      }
      return tipo;
    } catch (error) {
      handleExceptions(error, 'findOne');
    }
  }

  async update(
    id: number,
    updateMarcarParadaDto: UpdateMarcarParadaDto,
  ): Promise<MarcarParada> {
    try {
      const existeMarcarParada = await this.findOne(id);

      updateMarcarParadaDto.tipo = capitalizeTextos(updateMarcarParadaDto.tipo);

      return this.prisma.marcarParada.update({
        where: { id },
        data: updateMarcarParadaDto,
      });
    } catch (error) {
      handleExceptions(error, 'update');
    }
  }

  async remove(id: number): Promise<MarcarParada> {
    try {
      const existeMarcarParada = await this.findOne(id);

      return this.prisma.marcarParada.delete({
        where: { id },
      });
    } catch (error) {
      handleExceptions(error, 'remove');
    }
  }
}
