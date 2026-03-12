import { Controller } from '@nestjs/common';
import { AluminiService } from './alumini.service';

@Controller('alumini')
export class AluminiController {
  constructor(private readonly aluminiService: AluminiService) {}
}
