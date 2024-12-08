import { Decimal } from '@prisma/client/runtime/library';

export interface DatosHojaRuta {
  id: number;
  monto: Decimal;
  nombres: string;
  apellidos: string;
  ci: string;
  placa: string;
  propietario: string;
  grupo: string;
  nro: string;
  fecha_registro: string;
}
