import { Test, TestingModule } from '@nestjs/testing';
import { CancelledOrdersService } from './cancelled-orders.service';

describe('CancelledOrdersService', () => {
  let service: CancelledOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CancelledOrdersService],
    }).compile();

    service = module.get<CancelledOrdersService>(CancelledOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
