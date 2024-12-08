import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { ParadasService } from './paradas.service';

import { UpdateParadaDto } from './dto/update-parada.dto';
import { CreateParadaDto } from './dto/create-parada.dto';
import { Roles } from 'src/administracion/auth/roles.decorator';
import { RolesGuard } from 'src/administracion/auth/roles.guard';
import { Role } from 'src/administracion/auth/role.enum';

@Controller('paradas')
@UseGuards(RolesGuard)
@Roles(Role.User, Role.Admin)
export class ParadasController {
  constructor(private readonly paradasService: ParadasService) { }

  @Post(':idregistrador')
  create(@Param('idregistrador') idregistrador: string, @Body() createParadaDto: CreateParadaDto) {
    return this.paradasService.create(+idregistrador, createParadaDto);
  }

  @Get()
  findAll() {
    return this.paradasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paradasService.findOne(+id);
  }
  @Get('poriniciofinal/:iniciofin/:paradabus')
  findOneInicioFinal(@Param('iniciofin') iniciofin: string, @Param('paradabus') paradabus: string) {
    return this.paradasService.findOneInicioFinal(iniciofin, paradabus);
  }

  @Get('porparada/:parada')
  findAllParadas(@Param('parada') parada: string) {
    return this.paradasService.findAllParadas(parada);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParadaDto: UpdateParadaDto) {
    return this.paradasService.update(+id, updateParadaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paradasService.remove(+id);
  }
}
