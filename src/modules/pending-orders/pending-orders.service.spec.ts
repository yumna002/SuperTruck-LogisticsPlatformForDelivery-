import { Test, TestingModule } from '@nestjs/testing';
import { PendingOrdersService } from './pending-orders.service';

describe('PendingOrdersService', () => {
  let service: PendingOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingOrdersService],
    }).compile();

    service = module.get<PendingOrdersService>(PendingOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
