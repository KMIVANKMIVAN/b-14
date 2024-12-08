import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateParadaDto } from './dto/create-parada.dto';
import { UpdateParadaDto } from './dto/update-parada.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Parada } from '@prisma/client';
import { handleExceptions } from 'src/utils/handleExceptions';
import { capitalizeTextos } from 'src/utils/capitalizeTextos';
@Injectable()
export class ParadasService {
  constructor(private readonly prisma: PrismaService) { }

  async createSemilla(
    createParadaDto: CreateParadaDto): Promise<Parada> {
    console.log("createParadaDto", createParadaDto);

    try {
      createParadaDto.parada = capitalizeTextos(createParadaDto.parada);
      createParadaDto.tipo = capitalizeTextos(createParadaDto.tipo);

      const existeParada = await this.prisma.parada.findFirst({ where: { parada: createParadaDto.parada, tipo: createParadaDto.tipo } });
      if (existeParada) {
        throw new BadRequestException({
          message: 'El Parada ya fue registrado.',
        });
      }

      return this.prisma.parada.create({
        data: createParadaDto,
      });

    } catch (error) {
      handleExceptions(error, 'create');

    }

  }
  async create(idregistrador: number, createParadaDto: CreateParadaDto): Promise<Parada> {
    console.log("createParadaDto", createParadaDto);

    try {
      createParadaDto.parada = capitalizeTextos(createParadaDto.parada);
      createParadaDto.tipo = capitalizeTextos(createParadaDto.tipo);
      createParadaDto.id_registrador = idregistrador

      const existeParada = await this.prisma.parada.findFirst({ where: { parada: createParadaDto.parada, tipo: createParadaDto.tipo } });
      if (existeParada) {
        throw new BadRequestException({
          message: 'El Parada ya fue registrado.',
        });
      }

      return this.prisma.parada.create({
        data: createParadaDto,
      });

    } catch (error) {
      handleExceptions(error, 'create');

    }

  }

  async findAll(): Promise<Parada[]> {
    try {
      const paradaes = await this.prisma.parada.findMany();
      if (!paradaes || paradaes.length === 0) {
        throw new NotFoundException({
          message: `No se encontraron Paradaes`,
        });
      }
      return paradaes
    } catch (error) {
      handleExceptions(error, 'findAll');

    }
  }

  async findOne(id: number): Promise<Parada> {
    try {
      const parada = await this.prisma.parada.findUnique({
        where: { id },
      });
      if (!parada) {
        throw new NotFoundException({
          message: `Parada con id ${id} no encontrado`,
        });
      }
      return parada
    } catch (error) {
      handleExceptions(error, 'findOne');

    }
  }
  async findOneInicioFinal(iniciofin: string, paradabus: string): Promise<Parada> {
    try {
      const parada = await this.prisma.parada.findFirst({
        where: {
          tipo: iniciofin,
          parada: paradabus,
        },
      });
      if (!parada) {
        throw new NotFoundException({
          message: `Parada ${paradabus} y tipo ${iniciofin} no encontrado`,
        });
      }
      return parada
    } catch (error) {
      handleExceptions(error, 'findOneInicioFinal');

    }
  }
  async findAllParadas(parada: string): Promise<Parada[]> {
    try {
      const paradaes = await this.prisma.parada.findMany({
        where: {
          parada: {
            contains: parada, // Usar 'contains' para búsqueda tipo LIKE
            mode: 'insensitive', // Opcional: para búsqueda sin distinción entre mayúsculas y minúsculas
          },
        },
      });

      if (!paradaes || paradaes.length === 0) {
        throw new NotFoundException({
          message: `Parada "${parada}" no encontrado`,
        });
      }

      return paradaes
    } catch (error) {
      handleExceptions(error, 'findAllParadas');
    }
  }


  async update(id: number, updateParadaDto: UpdateParadaDto): Promise<Parada> {
    try {
      const existeParada = await this.findOne(id);

      updateParadaDto.parada = capitalizeTextos(updateParadaDto.parada);
      updateParadaDto.tipo = capitalizeTextos(updateParadaDto.tipo);

      return this.prisma.parada.update({
        where: { id },
        data: updateParadaDto,
      });

    } catch (error) {

      handleExceptions(error, 'update');
    }
  }

  async remove(id: number): Promise<Parada> {
    try {
      const existeParada = await this.findOne(id);

      return this.prisma.parada.delete({
        where: { id },
      });
    } catch (error) {
      handleExceptions(error, 'remove');

    }
  }
}
