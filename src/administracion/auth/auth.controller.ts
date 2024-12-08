import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,

} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { UnauthorizedExceptionFilter } from '../filtros/unauthorized-exception.filter';

@Controller('auth')
@UseFilters(UnauthorizedExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  signIn(@Body() signInDto: { ci: string; contrasenia: string }) {
    return this.authService.signIn(signInDto.ci, signInDto.contrasenia);
  }

  @Public()
  @Get()
  findAll() {
    return 'hola';
  }
}
