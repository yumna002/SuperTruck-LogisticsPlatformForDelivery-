import { Test, TestingModule } from '@nestjs/testing';
import { TruckModelsController } from './truck-models.controller';
import { TruckModelsService } from './truck-models.service';

describe('TruckModelsController', () => {
  let controller: TruckModelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TruckModelsController],
      providers: [TruckModelsService],
    }).compile();

    controller = module.get<TruckModelsController>(TruckModelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
