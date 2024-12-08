import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";

export function handleExceptions(error: any, nombreMetodo: string): void {
  if (error instanceof NotFoundException || error instanceof BadRequestException) {
    throw error;
  } else {
    throw new InternalServerErrorException({
      message: `Error del Servidor. Revisar el metodo (${nombreMetodo}) de la ruta "usuarios"`,
      error: `${error}`,
    });
  }
}

