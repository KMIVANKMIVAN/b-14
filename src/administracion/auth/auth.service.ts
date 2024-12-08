import {

  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { handleExceptions } from 'src/utils/handleExceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,

    private jwtService: JwtService,
  ) { }

  async signIn(ci: string, contrasenia: string): Promise<any> {
    try {
      const usuario = await this.usuarioService.findOneCI(ci);
      const isMatch = await bcrypt.compare(contrasenia, usuario.contrasenia);
      if (isMatch) {
        const payload = {
          id: usuario.id,
          ci: usuario.ci,
          camb_contra: usuario.se_cambiado_cntr,
          es_activo: usuario.es_activo,
          rol: {
            id: usuario.rol.id,
            rol: usuario.rol.rol,
          },
        };
        return {
          tk: await this.jwtService.signAsync(payload),
        };
      } else {
        throw new NotFoundException({
          message: `Se introdujo una contrasena incorecta vuelva a intentarlo`,
        });
      }
    } catch (error) {
      handleExceptions(error, 'signIn');

    }
  }
}
