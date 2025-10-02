import { Test, TestingModule } from '@nestjs/testing';
import { ProcessingOrdersController } from './processing-orders.controller';
import { ProcessingOrdersService } from './processing-orders.service';

describe('ProcessingOrdersController', () => {
  let controller: ProcessingOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessingOrdersController],
      providers: [ProcessingOrdersService],
    }).compile();

    controller = module.get<ProcessingOrdersController>(ProcessingOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
