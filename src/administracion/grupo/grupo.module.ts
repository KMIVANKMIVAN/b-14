import { Module } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [GrupoController],
  providers: [GrupoService, PrismaService],
})
export class GrupoModule { }
