import { Test, TestingModule } from '@nestjs/testing';
import { MarcarparadasController } from './marcarparadas.controller';
import { MarcarparadasService } from './marcarparadas.service';

describe('MarcarparadasController', () => {
  let controller: MarcarparadasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarcarparadasController],
      providers: [MarcarparadasService],
    }).compile();

    controller = module.get<MarcarparadasController>(MarcarparadasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
