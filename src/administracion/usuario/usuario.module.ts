import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolService } from '../rol/rol.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, PrismaService, RolService],
})
export class UsuarioModule { }
