import { Test, TestingModule } from '@nestjs/testing';
import { AluminiController } from './alumini.controller';
import { AluminiService } from './alumini.service';

describe('AluminiController', () => {
  let controller: AluminiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AluminiController],
      providers: [AluminiService],
    }).compile();

    controller = module.get<AluminiController>(AluminiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
