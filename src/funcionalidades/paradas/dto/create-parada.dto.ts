import { Parada } from '@prisma/client';
export type CreateParadaDto = Omit<Parada, 'id'>;
