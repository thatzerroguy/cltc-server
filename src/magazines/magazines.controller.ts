import { Controller } from '@nestjs/common';
import { MagazinesService } from './magazines.service';

@Controller('magazines')
export class MagazinesController {
  constructor(private readonly magazinesService: MagazinesService) {}
}
