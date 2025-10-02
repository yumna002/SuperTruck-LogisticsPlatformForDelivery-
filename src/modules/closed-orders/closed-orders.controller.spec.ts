import { Test, TestingModule } from '@nestjs/testing';
import { ClosedOrdersController } from './closed-orders.controller';
import { ClosedOrdersService } from './closed-orders.service';

describe('ClosedOrdersController', () => {
  let controller: ClosedOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClosedOrdersController],
      providers: [ClosedOrdersService],
    }).compile();

    controller = module.get<ClosedOrdersController>(ClosedOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
