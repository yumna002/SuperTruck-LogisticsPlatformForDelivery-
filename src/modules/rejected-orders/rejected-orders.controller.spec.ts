import { Test, TestingModule } from '@nestjs/testing';
import { RejectedOrdersController } from './rejected-orders.controller';
import { RejectedOrdersService } from './rejected-orders.service';

describe('RejectedOrdersController', () => {
  let controller: RejectedOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RejectedOrdersController],
      providers: [RejectedOrdersService],
    }).compile();

    controller = module.get<RejectedOrdersController>(RejectedOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
