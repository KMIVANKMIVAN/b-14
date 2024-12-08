import { BadRequestException, Injectable } from '@nestjs/common';
import { RolService } from '../rol/rol.service';
import { UsuarioService } from '../usuario/usuario.service';
import { handleExceptions } from 'src/utils/handleExceptions';
import { Rol, Usuario } from '@prisma/client';
import { SEMILLA_Rol, SEMILLA_Usuario, SEMILLA_Grupo } from './datos/semilla-datos';
import { ConfigService } from '@nestjs/config';
import { GrupoService } from '../grupo/grupo.service';

@Injectable()
export class SemillaService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,

    private readonly usuarioService: UsuarioService,
    private readonly roleService: RolService,
    private readonly grupoService: GrupoService,

  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async ejecutarSemilla() {
    try {
      if (this.isProd) {
        throw new BadRequestException({
          error: `Error al ejecutar la semilla`,
          message: `Problemas en la ejecucion de la semilla`,
        });
      }

      //?EJECUTAR POR ORDEN
      await this.crearRoles();
      await this.crearGrupos();

      await this.crearUsuarios();

      return true;


    } catch (error) {
      handleExceptions(error, 'ejecutarSemilla');
    }
  }
  async crearRoles(): Promise<Rol> {
    const roles = [];
    for (const rol of SEMILLA_Rol) {
      roles.push(await this.roleService.create(rol));
    }
    return roles[0];
  }
  async crearGrupos(): Promise<Rol> {
    const grupos = [];
    for (const grupo of SEMILLA_Grupo) {
      grupos.push(await this.grupoService.create(grupo));
    }
    return grupos[0];
  }
  //!CREAR DEPENDIENTES EN ORDEN
  async crearUsuarios(): Promise<Usuario> {
    const usuarios = [];
    for (const usuario of SEMILLA_Usuario) {
      // console.log(usuario);
      usuarios.push(await this.usuarioService.createSemilla(usuario));
    }
    return usuarios[0];
  }
}
