import { Module } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { AsistenciasController } from './asistencias.controller';
import { RolService } from 'src/administracion/rol/rol.service';
import { UsuarioService } from 'src/administracion/usuario/usuario.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AsistenciasController],
  providers: [AsistenciasService, PrismaService, UsuarioService, RolService],
})
export class AsistenciasModule {}
