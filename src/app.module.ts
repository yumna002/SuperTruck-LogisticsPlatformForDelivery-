import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './modules/customers/customers.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { TrucksModule } from './modules/trucks/trucks.module';
import { RatesModule } from './modules/rates/rates.module';
import { ItemsModule } from './modules/items/items.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuthModule } from './modules/auth/auth.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TruckModelsModule } from './modules/truck-models/truck-models.module';
import { OrdersModule } from './modules/orders/orders.module';
import { DatabaseModule } from './database/database.module';
import { TryModule } from './try/try.module';
import { i18nConfig } from './common/i18n/i18n.config';
import { I18nModule } from 'nestjs-i18n';
import { ProcessingOrdersModule } from './modules/processing-orders/processing-orders.module';
import { RejectedOrdersModule } from './modules/rejected-orders/rejected-orders.module';
import { CancelledOrdersModule } from './modules/cancelled-orders/cancelled-orders.module';
import { UsersModule } from './modules/users/users.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { TransformResponseInterceptor } from './common/interceptors/responseTransform.interceptor';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { ClosedOrdersModule } from './modules/closed-orders/closed-orders.module';
import { PendingOrdersModule } from './modules/pending-orders/pending-orders.module';
import { ScheduledOrdersModule } from './modules/scheduled-orders/scheduled-orders.module';
import { SchedulerModule } from './scheduler/scheduler.module';



@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot(i18nConfig),
    SchedulerModule,

    CustomersModule, 
    DriversModule, 
    EmployeesModule, 
    TrucksModule, 
    RatesModule, 
    ItemsModule, 
    PaymentsModule, 
    AddressesModule, 
    NotificationsModule, 
    AuthModule, 
    PricingModule, 
    CategoriesModule, 
    TruckModelsModule, 
    OrdersModule, 
    DatabaseModule, 
    TryModule, 
    ProcessingOrdersModule, 
    RejectedOrdersModule, 
    CancelledOrdersModule, 
    UsersModule,
    WhatsappModule,
    ClosedOrdersModule,
    PendingOrdersModule,
    ScheduledOrdersModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService, TransformResponseInterceptor],
})
export class AppModule {}
