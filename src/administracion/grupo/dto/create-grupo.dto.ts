import { Grupo } from '@prisma/client';
export type CreateGrupoDto = Omit<Grupo, 'id'>;
