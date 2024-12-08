import { Module } from '@nestjs/common';
import { SemillafuncionalidadesService } from './semillafuncionalidades.service';
import { SemillafuncionalidadesController } from './semillafuncionalidades.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParadasService } from '../paradas/paradas.service';
import { ConfigService } from '@nestjs/config';
import { AsistenciasService } from '../asistencias/asistencias.service';
import { UsuarioService } from 'src/administracion/usuario/usuario.service';
import { RolService } from 'src/administracion/rol/rol.service';
import { HojarutasService } from '../hojarutas/hojarutas.service';
import { MarcarparadasService } from '../marcarparadas/marcarparadas.service';

@Module({
  controllers: [SemillafuncionalidadesController],
  providers: [
    SemillafuncionalidadesService,
    PrismaService,
    ParadasService,
    AsistenciasService,
    HojarutasService,
    MarcarparadasService,
    UsuarioService,
    RolService,
    ConfigService,
  ],
})
export class SemillafuncionalidadesModule {}
