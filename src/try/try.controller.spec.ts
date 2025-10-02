import { Test, TestingModule } from '@nestjs/testing';
import { TryController } from './try.controller';
import { TryService } from './try.service';

describe('TryController', () => {
  let controller: TryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TryController],
      providers: [TryService],
    }).compile();

    controller = module.get<TryController>(TryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
