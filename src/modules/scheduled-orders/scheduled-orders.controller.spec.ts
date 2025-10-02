import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledOrdersController } from './scheduled-orders.controller';
import { ScheduledOrdersService } from './scheduled-orders.service';

describe('ScheduledOrdersController', () => {
  let controller: ScheduledOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduledOrdersController],
      providers: [ScheduledOrdersService],
    }).compile();

    controller = module.get<ScheduledOrdersController>(ScheduledOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
