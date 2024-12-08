import { Test, TestingModule } from '@nestjs/testing';
import { SemillaService } from './semilla.service';

describe('SemillaService', () => {
  let service: SemillaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemillaService],
    }).compile();

    service = module.get<SemillaService>(SemillaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
