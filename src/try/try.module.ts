import { Module } from '@nestjs/common';
import { TryService } from './try.service';
import { TryController } from './try.controller';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [],
  controllers: [TryController],
  providers: [TryService],
  exports: [TryService]
})
export class TryModule {}
