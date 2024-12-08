import { Test, TestingModule } from '@nestjs/testing';
import { MarcarparadasService } from './marcarparadas.service';

describe('MarcarparadasService', () => {
  let service: MarcarparadasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarcarparadasService],
    }).compile();

    service = module.get<MarcarparadasService>(MarcarparadasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
