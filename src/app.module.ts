import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsuarioModule } from './administracion/usuario/usuario.module';
import { RolModule } from './administracion/rol/rol.module';
import { AuthModule } from './administracion/auth/auth.module';
import { SemillaModule } from './administracion/semilla/semilla.module';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './administracion/auth/jwt-auth.guard';
import { RolesGuard } from './administracion/auth/roles.guard';
import { ParadasModule } from './funcionalidades/paradas/paradas.module';
import { MarcarparadasModule } from './funcionalidades/marcarparadas/marcarparadas.module';
import { SemillafuncionalidadesModule } from './funcionalidades/semillafuncionalidades/semillafuncionalidades.module';
import { GrupoModule } from './administracion/grupo/grupo.module';
import { HojarutasModule } from './funcionalidades/hojarutas/hojarutas.module';
import { AsistenciasModule } from './funcionalidades/asistencias/asistencias.module';
@Module({
  imports: [
    UsuarioModule,
    RolModule,
    AuthModule,
    SemillaModule,
    ParadasModule,
    MarcarparadasModule,
    SemillafuncionalidadesModule,
    GrupoModule,
    HojarutasModule,
    AsistenciasModule,
  ],
  controllers: [AppController],
  /* providers: [AppService, PrismaService, {
    provide: APP_GUARD,
    useClass: RolesGuard,
    // useClass: JwtAuthGuard,
  },], */
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Primero autenticar
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Luego verificar roles
    },
  ],
})
export class AppModule {}
