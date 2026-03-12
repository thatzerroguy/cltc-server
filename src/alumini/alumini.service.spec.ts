import { Test, TestingModule } from '@nestjs/testing';
import { AluminiService } from './alumini.service';

describe('AluminiService', () => {
  let service: AluminiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AluminiService],
    }).compile();

    service = module.get<AluminiService>(AluminiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
