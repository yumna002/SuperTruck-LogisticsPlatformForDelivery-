import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ItemSize } from './entities/item-size.entity';
import { ItemWeight } from './entities/item-weight.entity';
import { UsersModule } from '../users/users.module';



@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Item]), TypeOrmModule.forFeature([ItemSize]), TypeOrmModule.forFeature([ItemWeight])],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService]
})
export class ItemsModule {}
