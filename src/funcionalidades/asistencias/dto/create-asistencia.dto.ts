import { Asistencia } from '@prisma/client';
export type CreateAsistenciaDto = Omit<Asistencia, 'id'>;
