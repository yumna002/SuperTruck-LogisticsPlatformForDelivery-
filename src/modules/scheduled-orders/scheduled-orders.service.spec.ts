import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledOrdersService } from './scheduled-orders.service';

describe('ScheduledOrdersService', () => {
  let service: ScheduledOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduledOrdersService],
    }).compile();

    service = module.get<ScheduledOrdersService>(ScheduledOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
