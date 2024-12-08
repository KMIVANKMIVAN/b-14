import { Test, TestingModule } from '@nestjs/testing';
import { SemillafuncionalidadesService } from './semillafuncionalidades.service';

describe('SemillafuncionalidadesService', () => {
  let service: SemillafuncionalidadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemillafuncionalidadesService],
    }).compile();

    service = module.get<SemillafuncionalidadesService>(SemillafuncionalidadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
