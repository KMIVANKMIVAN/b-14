import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { MarcarparadasService } from './marcarparadas.service';
import { CreateMarcarParadaDto } from './dto/create-marcarparada.dto';
import { UpdateMarcarParadaDto } from './dto/update-marcarparada.dto';
@Controller('marcarparadas')
export class MarcarparadasController {
  constructor(private readonly marcarparadasService: MarcarparadasService) { }

  @Post()
  create(@Body() createMarcarParadaDto: CreateMarcarParadaDto) {
    return this.marcarparadasService.create(createMarcarParadaDto);
  }

  @Get()
  findAll() {
    return this.marcarparadasService.findAll();
  }
  @Get('transformados')
  findAllTransformados() {
    return this.marcarparadasService.findAllTransformados();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcarparadasService.findOne(+id);
  }

  @Get('porfecha/:fechainicio/:fechafin/:idgrupo')
  // @Get('porfecha/:fechainicio/:fechafin/:idgrupo/:cioplaca')
  findAllPorFecha(
    @Param('fechainicio') fechainicio: string,
    @Param('fechafin') fechafin: string,
    @Param('idgrupo') idgrupo: number,
    @Query('cioplaca') cioplaca?: string
    // @Param('cioplaca') cioplaca: string
  ) {
    return this.marcarparadasService.findAllPorFecha(fechainicio, fechafin, +idgrupo, cioplaca); // Pasa el nuevo parámetro al servicio
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcarParadaDto: UpdateMarcarParadaDto) {
    return this.marcarparadasService.update(+id, updateMarcarParadaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcarparadasService.remove(+id);
  }
}
