import { Controller, Post } from '@nestjs/common';
import { SemillaService } from './semilla.service';
import { Public } from '../auth/public.decorator';

@Controller('semillas')
export class SemillaController {
  constructor(private readonly semillaService: SemillaService) {}

  @Public()
  @Post('ejecutarsemilla')
  ejecutarSemilla() {
    return this.semillaService.ejecutarSemilla();
  }
}
