import { Test, TestingModule } from '@nestjs/testing';
import { ParadasService } from './paradas.service';

describe('ParadasService', () => {
  let service: ParadasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParadasService],
    }).compile();

    service = module.get<ParadasService>(ParadasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
