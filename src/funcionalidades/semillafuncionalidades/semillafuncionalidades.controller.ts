import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SemillafuncionalidadesService } from './semillafuncionalidades.service';
import { Public } from 'src/administracion/auth/public.decorator';

@Controller('semillafuncionalidades')
export class SemillafuncionalidadesController {
  constructor(private readonly semillafuncionalidadesService: SemillafuncionalidadesService) { }

  @Public()
  @Post('ejecutarsemillaparadas')
  create() {
    return this.semillafuncionalidadesService.ejecutarSemilla();
  }
}
