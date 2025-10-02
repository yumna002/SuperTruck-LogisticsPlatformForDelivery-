import { Test, TestingModule } from '@nestjs/testing';
import { TryService } from './try.service';

describe('TryService', () => {
  let service: TryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TryService],
    }).compile();

    service = module.get<TryService>(TryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
