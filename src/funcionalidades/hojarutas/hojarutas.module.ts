import { Module } from '@nestjs/common';
import { HojarutasService } from './hojarutas.service';
import { HojarutasController } from './hojarutas.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolService } from 'src/administracion/rol/rol.service';
import { UsuarioService } from 'src/administracion/usuario/usuario.service';

@Module({
  controllers: [HojarutasController],
  providers: [HojarutasService, PrismaService, UsuarioService, RolService],
})
export class HojarutasModule {}
