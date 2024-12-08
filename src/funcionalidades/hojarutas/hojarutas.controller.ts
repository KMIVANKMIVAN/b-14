import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { HojarutasService } from './hojarutas.service';
import { CreateHojarutaDto } from './dto/create-hojaruta.dto';
import { UpdateHojarutaDto } from './dto/update-hojaruta.dto';
import { RolesGuard } from 'src/administracion/auth/roles.guard';

@Controller('hojarutas')
@UseGuards(RolesGuard)
export class HojarutasController {
  constructor(private readonly hojarutasService: HojarutasService) {}

  @Post(':idregistrador')
  create(
    @Param('idregistrador') idregistrador: string,
    @Body() createHojarutaDto: CreateHojarutaDto,
  ) {
    return this.hojarutasService.create(+idregistrador, createHojarutaDto);
  }

  @Get()
  findAll() {
    return this.hojarutasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hojarutasService.findOne(+id);
  }

  @Get('porfecha/:fechainicio/:fechafin/:idgrupo')
  findAllPorFecha(
    @Param('fechainicio') fechainicio: string,
    @Param('fechafin') fechafin: string,
    @Param('idgrupo') idgrupo: number,
    @Query('cioplaca') cioplaca?: string,
  ) {
    return this.hojarutasService.findAllPorFecha(
      fechainicio,
      fechafin,
      +idgrupo,
      cioplaca,
    ); // Pasa el nuevo parámetro al servicio
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHojarutaDto: UpdateHojarutaDto,
  ) {
    return this.hojarutasService.update(+id, updateHojarutaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hojarutasService.remove(+id);
  }
}
