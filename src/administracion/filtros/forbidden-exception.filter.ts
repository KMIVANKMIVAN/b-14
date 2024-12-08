import { ExceptionFilter, Catch, ForbiddenException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(403).json({
      message: 'Acceso denegado. No tienes permisos suficientes para realizar esta acción.',
    });
  }
}