import { Test, TestingModule } from '@nestjs/testing';
import { HojarutasController } from './hojarutas.controller';
import { HojarutasService } from './hojarutas.service';

describe('HojarutasController', () => {
  let controller: HojarutasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HojarutasController],
      providers: [HojarutasService],
    }).compile();

    controller = module.get<HojarutasController>(HojarutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
