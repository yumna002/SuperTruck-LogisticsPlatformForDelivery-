import { Test, TestingModule } from '@nestjs/testing';
import { CancelledOrdersController } from './cancelled-orders.controller';
import { CancelledOrdersService } from './cancelled-orders.service';

describe('CancelledOrdersController', () => {
  let controller: CancelledOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CancelledOrdersController],
      providers: [CancelledOrdersService],
    }).compile();

    controller = module.get<CancelledOrdersController>(CancelledOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
