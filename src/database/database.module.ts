import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Driver } from 'src/modules/drivers/entities/driver.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UserSeeder } from './seeds/userSeeder.seeder';
import { EmployeeSeeder } from './seeds/employeeSeeder.seeder';
import { CustomerSeeder } from './seeds/customerSeeder.seeder';
import { DriverSeeder } from './seeds/driverSeeder.seeder';
import { AddressSeeder } from './seeds/addressSeeder.seeder';
import { Role } from 'src/modules/users/entities/role.entity';
import { RoleSeeder } from './seeds/roleSeeder.seeder';
import { sizeTypeSeeder } from './seeds/sizeTypeSeeder.seeder';
import { VehicleTypeSeeder } from './seeds/vehicleTypeSeeder.seeder';
import { FuelTypeSeeder } from './seeds/fuelTypeSeeder.seeder';
import { TruckModel } from 'src/modules/truck-models/entities/truck-model.entity';
import { SizeType } from 'src/modules/truck-models/entities/size-type.entity';
import { VehicleType } from 'src/modules/truck-models/entities/vehicle-type.entity';
import { FuelType } from 'src/modules/truck-models/entities/fuel-type.entity';
import { TruckModelSeeder } from './seeds/truckModelSeeder.seeder';
import { Truck } from 'src/modules/trucks/entities/truck.entity';
import { TruckSeeder } from './seeds/truckSeeder.seeder';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { ItemSize } from 'src/modules/items/entities/item-size.entity';
import { ItemWeight } from 'src/modules/items/entities/item-weight.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { CategoryType } from 'src/modules/categories/entities/category-type.entity';
import { PaymentType } from 'src/modules/payments/entities/payment-type.entity';
import { OrderSeeder } from './seeds/orderSeeder.seeder';
import { CategorySeeder } from './seeds/categorySeeder.seeder';
import { CategoryTypeSeeder } from './seeds/categoryTypeSeeder.seeder';
import { ItemSeeder } from './seeds/itemSeeder.seeder';
import { ItemSizeSeeder } from './seeds/itemSizeSeeder.seeder';
import { ItemWeightSeeder } from './seeds/itemWeightSeeder.seeder';
import { PaymentTypeSeeder } from './seeds/paymentTypeSeeder.seeder';
import { ProcessingOrder } from 'src/modules/processing-orders/entities/processing-order.entity';
import { ClosedOrder } from 'src/modules/closed-orders/entities/closed-order.entity';
import { ProcessingOrderSeeder } from './seeds/processingOrderSeeder.seeder';
import { ClosedOrderSeeder } from './seeds/closedOrderSeeder.seeder';
import { Rate } from 'src/modules/rates/entities/rate.entity';
import { RateSeeder } from './seeds/rateSeeder.seeder';
import { RejectedOrder } from 'src/modules/rejected-orders/entities/rejected-order.entity';
import { RejectReason } from 'src/modules/rejected-orders/entities/reject-reason.entity';
import { RejectReasonSeeder } from './seeds/rejectReasonSeeder.seeder';
import { RejectedOrderSeeder } from './seeds/rejectedOrderSeeder.seeder';
import { Photo } from 'src/modules/orders/entities/photo.entity';
import { PendingOrder } from 'src/modules/pending-orders/entities/pending-order.entity';
import { ScheduledOrder } from 'src/modules/scheduled-orders/entities/scheduled-order.entity';
import { ScheduledOrderSeeder } from './seeds/scheduleOrderSeeder.seeder';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { Pricing } from 'src/modules/pricing/entities/pricing.entity';
import { PricingSeeder } from './seeds/pricingSeeder.seeder';
import { Profit } from 'src/modules/payments/entities/profit.entity';
import { ProfitSeeder } from './seeds/profitSeeder.seeder';



@Module({
  imports: [
    TypeOrmModule.forRootAsync({
	    useFactory() {
	      return {
	        type: 'mysql',
	        port: 3306,
	        host: 'localhost',
	        username: 'root',
	        password: 'root',
          database: 'supertruckdb',
          /*host: 'grad-supertruck-back-mysql',
          username: 'grad-project',
          password: 'grad-project123',
          database: 'grad-project',*/
          entities: [User, Driver, Customer, Employee, Address, Role, TruckModel, SizeType, VehicleType, FuelType, Truck, Order, Item, ItemSize, ItemWeight, Category, CategoryType, PaymentType, ProcessingOrder, ClosedOrder, Rate, RejectedOrder, RejectReason, Photo, PendingOrder, ScheduledOrder, Pricing,Profit],
	        synchronize: true,
	        logging: false,
	      };
	    },
	    async dataSourceFactory(options) {
	      if (!options) {
	        throw new Error('Invalid options passed');
	      }

	      return addTransactionalDataSource(new DataSource(options));
	    },
	  }),
    /*TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      host: 'grad-supertruck-back-mysql',
      username: 'grad-project',
      password: 'grad-project123',
      database: 'grad-project',
      host: 'localhost',
      username: 'root',
      password: 'root',
      database: 'supertruckdb',
      entities: [User, Driver, Customer, Employee, Address, Role, TruckModel, SizeType, VehicleType, FuelType, Truck],
      synchronize: true,
    }),*/
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Employee]),
    TypeOrmModule.forFeature([Driver]),
    TypeOrmModule.forFeature([Customer]),
    TypeOrmModule.forFeature([Address]),
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([TruckModel]),
    TypeOrmModule.forFeature([SizeType]),
    TypeOrmModule.forFeature([VehicleType]),
    TypeOrmModule.forFeature([FuelType]),
    TypeOrmModule.forFeature([Truck]),
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([Item]),
    TypeOrmModule.forFeature([ItemSize]),
    TypeOrmModule.forFeature([ItemWeight]),
    TypeOrmModule.forFeature([CategoryType]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([PaymentType]),
    TypeOrmModule.forFeature([ProcessingOrder]),
    TypeOrmModule.forFeature([ClosedOrder]),
    TypeOrmModule.forFeature([Rate]),
    TypeOrmModule.forFeature([RejectedOrder]),
    TypeOrmModule.forFeature([RejectReason]),
    TypeOrmModule.forFeature([Photo]),
    TypeOrmModule.forFeature([PendingOrder]),
    TypeOrmModule.forFeature([ScheduledOrder]),
    TypeOrmModule.forFeature([Pricing]),
    TypeOrmModule.forFeature([Profit])
  ],
  controllers: [DatabaseController],
  providers: [PricingSeeder, TruckSeeder, TruckModelSeeder, UserSeeder, EmployeeSeeder, CustomerSeeder, DriverSeeder, AddressSeeder, sizeTypeSeeder, VehicleTypeSeeder, FuelTypeSeeder, AddressSeeder, RoleSeeder, OrderSeeder, CategorySeeder, CategoryTypeSeeder, ItemSeeder, ItemSizeSeeder, ItemWeightSeeder, PaymentTypeSeeder,ProcessingOrderSeeder,ClosedOrderSeeder,RateSeeder,RejectReasonSeeder,RejectedOrderSeeder,ScheduledOrderSeeder, DatabaseService, ProfitSeeder],
  exports: [TypeOrmModule, DatabaseService]
})
export class DatabaseModule {}
