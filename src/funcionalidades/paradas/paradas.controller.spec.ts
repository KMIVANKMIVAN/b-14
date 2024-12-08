import { Test, TestingModule } from '@nestjs/testing';
import { ParadasController } from './paradas.controller';
import { ParadasService } from './paradas.service';

describe('ParadasController', () => {
  let controller: ParadasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParadasController],
      providers: [ParadasService],
    }).compile();

    controller = module.get<ParadasController>(ParadasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
