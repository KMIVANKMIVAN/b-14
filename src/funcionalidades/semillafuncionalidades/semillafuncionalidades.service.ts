import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParadasService } from '../paradas/paradas.service';
import { handleExceptions } from 'src/utils/handleExceptions';
import { Asistencia, HojaRuta, MarcarParada, Parada } from '@prisma/client';
import {
  SEMILLA_ASISTENCIA,
  SEMILLA_HOJA_RUTA,
  SEMILLA_MARCAR_PARADA,
  SEMILLA_PARADA,
} from './datos/semilla-datos';
import { PrismaService } from 'src/prisma/prisma.service';
import { AsistenciasService } from '../asistencias/asistencias.service';
import { HojarutasService } from '../hojarutas/hojarutas.service';
import { MarcarparadasService } from '../marcarparadas/marcarparadas.service';

@Injectable()
export class SemillafuncionalidadesService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,

    private readonly paradasService: ParadasService,
    private readonly prismaService: PrismaService,
    private readonly asistenciasService: AsistenciasService,
    private readonly hojarutasService: HojarutasService,
    private readonly marcarparadasService: MarcarparadasService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }
  async ejecutarSemilla() {
    try {
      if (this.isProd) {
        throw new BadRequestException({
          error: `Error al ejecutar la semilla`,
          message: `Problemas en la ejecucion de la semilla`,
        });
      }

      // await this.eliminarParadas();
      //?EJECUTAR POR ORDEN
      await this.crearParadas();
      await this.crearAsistencias();
      await this.crearHojarutas();
      await this.crearMarcarparadas();

      return true;
    } catch (error) {
      handleExceptions(error, 'ejecutarSemilla');
    }
  }
  // Método para eliminar todos los registros de la tabla "Parada"
  async eliminarParadas(): Promise<void> {
    await this.prismaService.parada.deleteMany(); // Elimina todos los registros de la tabla Parada
  }

  //!en orden
  async crearParadas(): Promise<Parada> {
    const paradas = [];
    for (const parada of SEMILLA_PARADA) {
      paradas.push(await this.paradasService.createSemilla(parada));
    }
    return paradas[0];
  }

  //!en orden son dependientes
  async crearAsistencias(): Promise<Asistencia> {
    const asistencias = [];
    for (const asistencia of SEMILLA_ASISTENCIA) {
      // console.log(asistencia);
      asistencias.push(await this.asistenciasService.create(asistencia));
    }
    return asistencias[0];
  }
  async crearHojarutas(): Promise<HojaRuta> {
    const hojaRutas = [];
    for (const hojaRuta of SEMILLA_HOJA_RUTA) {
      // console.log(hojaRuta);
      hojaRutas.push(await this.hojarutasService.createSemilla(hojaRuta));
    }
    return hojaRutas[0];
  }
  async crearMarcarparadas(): Promise<MarcarParada> {
    const marcarParadas = [];
    for (const marcarParada of SEMILLA_MARCAR_PARADA) {
      // console.log(marcarParada);
      marcarParadas.push(await this.marcarparadasService.create(marcarParada));
    }
    return marcarParadas[0];
  }
}
