import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';

@Controller('usuarios')
@UseGuards(RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Roles(Role.Admin)
  @Post(':idregistrador')
  create(
    @Param('idregistrador') idregistrador: string,
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    return this.usuarioService.create(+idregistrador, createUsuarioDto);
  }

  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @Roles(Role.Admin)
  @Get('exacto/porci/:ci')
  findOneCI(@Param('ci') ci: string) {
    return this.usuarioService.findOneCI(ci);
  }

  @Roles(Role.Admin)
  @Get('porci/:ci')
  findAllCI(@Param('ci') ci: string) {
    return this.usuarioService.findAllCI(ci);
  }

  @Get('porciplaca/:ciplaca')
  findAllCIPlaca(@Param('ciplaca') ciplaca: string) {
    return this.usuarioService.findAllCIPlaca(ciplaca);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }
  @Patch('pw/:id')
  updatePw(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.updatePw(+id, updateUsuarioDto);
  }
  @Roles(Role.Admin)
  @Get('resetearpw/:id')
  updateResetearPw(@Param('id') id: string) {
    return this.usuarioService.updateResetearPw(+id);
  }
  @Roles(Role.Admin)
  @Get('darbaja/:id')
  updateDarBaja(@Param('id') id: string) {
    return this.usuarioService.updateDarBaja(+id);
  }
  @Roles(Role.Admin)
  @Get('daralta/:id')
  updateDarAlta(@Param('id') id: string) {
    return this.usuarioService.updateDarAlta(+id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
