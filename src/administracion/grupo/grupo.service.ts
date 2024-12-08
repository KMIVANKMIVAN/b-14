import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Grupo } from '@prisma/client';
import { handleExceptions } from 'src/utils/handleExceptions';
import { capitalizeTextos } from 'src/utils/capitalizeTextos';

@Injectable()
export class GrupoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createGrupoDto: CreateGrupoDto): Promise<Grupo> {

    try {
      createGrupoDto.grupo = capitalizeTextos(createGrupoDto.grupo);

      const existeGrupo = await this.prisma.grupo.findFirst({ where: { grupo: createGrupoDto.grupo } });
      if (existeGrupo) {
        throw new BadRequestException({
          message: 'El Grupo ya fue registrado.',
        });
      }

      return this.prisma.grupo.create({
        data: createGrupoDto,
      });

    } catch (error) {
      handleExceptions(error, 'create');

    }

  }

  async findAll(): Promise<Grupo[]> {
    try {
      const grupos = await this.prisma.grupo.findMany();
      if (!grupos || grupos.length === 0) {
        throw new NotFoundException({
          message: `No se encontraron Grupos`,
        });
      }
      return grupos
    } catch (error) {
      handleExceptions(error, 'findAll');

    }
  }

  async findOne(id: number): Promise<Grupo> {
    try {
      const grupo = await this.prisma.grupo.findUnique({
        where: { id },
      });
      if (!grupo) {
        throw new NotFoundException({
          message: `Grupo con id ${id} no encontrado`,
        });
      }
      return grupo
    } catch (error) {
      handleExceptions(error, 'findOne');

    }
  }
  async findAllGrupos(grupo: string): Promise<Grupo[]> {
    try {
      const grupos = await this.prisma.grupo.findMany({
        where: {
          grupo: {
            contains: grupo, // Usar 'contains' para búsqueda tipo LIKE
            mode: 'insensitive', // Opcional: para búsqueda sin distinción entre mayúsculas y minúsculas
          },
        },
      });

      if (!grupos || grupos.length === 0) {
        throw new NotFoundException({
          message: `Grupo "${grupo}" no encontrado`,
        });
      }

      return grupos
    } catch (error) {
      handleExceptions(error, 'findAllGrupos');
    }
  }


  async update(id: number, updateGrupoDto: UpdateGrupoDto): Promise<Grupo> {
    try {
      const existeGrupo = await this.findOne(id);

      updateGrupoDto.grupo = capitalizeTextos(updateGrupoDto.grupo);

      return this.prisma.grupo.update({
        where: { id },
        data: updateGrupoDto,
      });

    } catch (error) {

      handleExceptions(error, 'update');
    }
  }

  async remove(id: number): Promise<Grupo> {
    try {
      const existeGrupo = await this.findOne(id);

      return this.prisma.grupo.delete({
        where: { id },
      });
    } catch (error) {
      handleExceptions(error, 'remove');

    }
  }
}
