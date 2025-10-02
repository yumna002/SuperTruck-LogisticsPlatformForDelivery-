import { Test, TestingModule } from '@nestjs/testing';
import { PendingOrdersController } from './pending-orders.controller';
import { PendingOrdersService } from './pending-orders.service';

describe('PendingOrdersController', () => {
  let controller: PendingOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PendingOrdersController],
      providers: [PendingOrdersService],
    }).compile();

    controller = module.get<PendingOrdersController>(PendingOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
