import { Test, TestingModule } from '@nestjs/testing';
import { ClosedOrdersService } from './closed-orders.service';

describe('ClosedOrdersService', () => {
  let service: ClosedOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClosedOrdersService],
    }).compile();

    service = module.get<ClosedOrdersService>(ClosedOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
