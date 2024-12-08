import { Module } from '@nestjs/common';
import { MarcarparadasService } from './marcarparadas.service';
import { MarcarparadasController } from './marcarparadas.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioService } from 'src/administracion/usuario/usuario.service';
import { RolService } from 'src/administracion/rol/rol.service';
import { ParadasService } from '../paradas/paradas.service';

@Module({
  controllers: [MarcarparadasController],
  providers: [MarcarparadasService, PrismaService, UsuarioService, RolService, ParadasService],
})
export class MarcarparadasModule { }
