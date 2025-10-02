import { Module } from '@nestjs/common';
import { TruckModelsService } from './truck-models.service';
import { TruckModelsController } from './truck-models.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TruckModel } from './entities/truck-model.entity';
import { UsersModule } from '../users/users.module';
import { TrucksModule } from '../trucks/trucks.module';
import { SizeType } from './entities/size-type.entity';
import { FuelType } from './entities/fuel-type.entity';
import { VehicleType } from './entities/vehicle-type.entity';



@Module({
  imports:[TrucksModule, UsersModule, TypeOrmModule.forFeature([TruckModel]),TypeOrmModule.forFeature([SizeType]),TypeOrmModule.forFeature([FuelType]),TypeOrmModule.forFeature([VehicleType])],
  controllers: [TruckModelsController],
  providers: [TruckModelsService],
  exports: [TruckModelsService]
})
export class TruckModelsModule {}
