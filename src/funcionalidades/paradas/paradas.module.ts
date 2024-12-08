import { Module } from '@nestjs/common';
import { ParadasService } from './paradas.service';
import { ParadasController } from './paradas.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ParadasController],
  providers: [ParadasService, PrismaService,],
})
export class ParadasModule { }
