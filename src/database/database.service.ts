import { INestApplication, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CustomerSeeder } from './seeds/customerSeeder.seeder';
import { EmployeeSeeder } from './seeds/employeeSeeder.seeder';
import { UserSeeder } from './seeds/userSeeder.seeder';
import { DriverSeeder } from './seeds/driverSeeder.seeder';
import { AddressSeeder } from './seeds/addressSeeder.seeder';
import { RoleSeeder } from './seeds/roleSeeder.seeder';
import { FuelTypeSeeder } from './seeds/fuelTypeSeeder.seeder';
import { sizeTypeSeeder } from './seeds/sizeTypeSeeder.seeder';
import { VehicleTypeSeeder } from './seeds/vehicleTypeSeeder.seeder';
import { TruckModelSeeder } from './seeds/truckModelSeeder.seeder';
import { TruckSeeder } from './seeds/truckSeeder.seeder';
import { CategorySeeder } from './seeds/categorySeeder.seeder';
import { CategoryTypeSeeder } from './seeds/categoryTypeSeeder.seeder';
import { ItemSizeSeeder } from './seeds/itemSizeSeeder.seeder';
import { ItemWeightSeeder } from './seeds/itemWeightSeeder.seeder';
import { PaymentTypeSeeder } from './seeds/paymentTypeSeeder.seeder';
import { OrderSeeder } from './seeds/orderSeeder.seeder';
import { ItemSeeder } from './seeds/itemSeeder.seeder';
import { ProcessingOrderSeeder } from './seeds/processingOrderSeeder.seeder';
import { ClosedOrderSeeder } from './seeds/closedOrderSeeder.seeder';
import { RateSeeder } from './seeds/rateSeeder.seeder';
import { RejectReasonSeeder } from './seeds/rejectReasonSeeder.seeder';
import { RejectedOrderSeeder } from './seeds/rejectedOrderSeeder.seeder';
import { ScheduledOrderSeeder } from './seeds/scheduleOrderSeeder.seeder';
import { PricingSeeder } from './seeds/pricingSeeder.seeder';
import { ProfitSeeder } from './seeds/profitSeeder.seeder';



@Injectable()
export class DatabaseService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly roleSeeder: RoleSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly fuelTypeSeeder: FuelTypeSeeder,
    private readonly sizeTypeSeeder: sizeTypeSeeder,
    private readonly vehicleTypeSeeder: VehicleTypeSeeder,
    private readonly employeeSeeder: EmployeeSeeder,
    private readonly truckModelSeeder: TruckModelSeeder,
    private readonly customerSeeder: CustomerSeeder,
    private readonly driverSeeder: DriverSeeder,
    private readonly addressSeeder: AddressSeeder,
    private readonly truckSeeder: TruckSeeder,
    private readonly categorySeeder: CategorySeeder,
    private readonly paymentTypeSeeder: PaymentTypeSeeder,
    private readonly itemSizeSeeder: ItemSizeSeeder,
    private readonly itemWeightSeeder: ItemWeightSeeder,
    private readonly orderSeeder: OrderSeeder,
    private readonly categoryTypeSeeder: CategoryTypeSeeder,
    private readonly itemSeeder: ItemSeeder,
    private readonly processingOrderSeeder: ProcessingOrderSeeder,
    private readonly closedOrderSeeder: ClosedOrderSeeder,
    private readonly rateSeeder: RateSeeder,
    private readonly rejectReasonSeeder: RejectReasonSeeder,
    private readonly rejectedOrderSeeder: RejectedOrderSeeder,
    private readonly scheduledOrderSeeder: ScheduledOrderSeeder,
    private readonly pricingSeeder: PricingSeeder,
    private readonly profitSeeder: ProfitSeeder
  ) {}


  async refreshDB() {
    try {
      await this.dataSource.dropDatabase();

      await this.dataSource.synchronize();

      await this.runAllSeeders();

    } catch (error) {
      console.error('Error during DB refresh');
      throw error;
    }
  }

  async runAllSeeders() {
    await this.roleSeeder.run();
    await this.userSeeder.run();
    await this.fuelTypeSeeder.run();
    await this.sizeTypeSeeder.run();
    await this.vehicleTypeSeeder.run();
    await this.employeeSeeder.run();
    await this.truckModelSeeder.run();
    await this.customerSeeder.run();
    await this.driverSeeder.run();
    await this.addressSeeder.run();
    await this.truckSeeder.run();
    await this.categorySeeder.run();
    await this.paymentTypeSeeder.run();
    await this.itemSizeSeeder.run();
    await this.itemWeightSeeder.run();
    await this.orderSeeder.run();
    await this.categoryTypeSeeder.run();
    await this.itemSeeder.run();
    await this.processingOrderSeeder.run();
    await this.closedOrderSeeder.run();
    await this.rateSeeder.run();
    await this.rejectReasonSeeder.run();
    await this.rejectedOrderSeeder.run();
    await this.scheduledOrderSeeder.run();
    await this.pricingSeeder.run();
    await this.profitSeeder.run();
  }
}
