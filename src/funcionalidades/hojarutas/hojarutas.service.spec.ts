import { Test, TestingModule } from '@nestjs/testing';
import { HojarutasService } from './hojarutas.service';

describe('HojarutasService', () => {
  let service: HojarutasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HojarutasService],
    }).compile();

    service = module.get<HojarutasService>(HojarutasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
