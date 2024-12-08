import { Test, TestingModule } from '@nestjs/testing';
import { SemillafuncionalidadesController } from './semillafuncionalidades.controller';
import { SemillafuncionalidadesService } from './semillafuncionalidades.service';

describe('SemillafuncionalidadesController', () => {
  let controller: SemillafuncionalidadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SemillafuncionalidadesController],
      providers: [SemillafuncionalidadesService],
    }).compile();

    controller = module.get<SemillafuncionalidadesController>(SemillafuncionalidadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
