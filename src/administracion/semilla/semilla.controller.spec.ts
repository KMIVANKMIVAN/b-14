import { Test, TestingModule } from '@nestjs/testing';
import { SemillaController } from './semilla.controller';
import { SemillaService } from './semilla.service';

describe('SemillaController', () => {
  let controller: SemillaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SemillaController],
      providers: [SemillaService],
    }).compile();

    controller = module.get<SemillaController>(SemillaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
