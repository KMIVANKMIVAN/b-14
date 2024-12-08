import { Module } from '@nestjs/common';
import { SemillaService } from './semilla.service';
import { SemillaController } from './semilla.controller';
import { ConfigService } from '@nestjs/config';
import { UsuarioService } from '../usuario/usuario.service';
import { RolService } from '../rol/rol.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GrupoService } from '../grupo/grupo.service';

@Module({
  controllers: [SemillaController],
  providers: [SemillaService, PrismaService, ConfigService, UsuarioService, RolService, GrupoService],
  // providers: [SemillaService],
})
export class SemillaModule { }
