import { forwardRef, Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pricing } from './entities/pricing.entity';
import { GoogleMapsModule } from 'src/integrations/google-maps/google-maps.module';
import { AddressesModule } from '../addresses/addresses.module';
import { ClosedOrdersModule } from '../closed-orders/closed-orders.module';
import { TruckModelsModule } from '../truck-models/truck-models.module';
import { ProcessingOrdersModule } from '../processing-orders/processing-orders.module';
import { ItemsModule } from '../items/items.module';
import { DriversModule } from '../drivers/drivers.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [UsersModule, forwardRef(()=>PaymentsModule), forwardRef(()=>DriversModule), forwardRef(()=>ProcessingOrdersModule), ItemsModule, TruckModelsModule, GoogleMapsModule, forwardRef(()=>ClosedOrdersModule), AddressesModule, forwardRef(()=>OrdersModule),TypeOrmModule.forFeature([Pricing]),TruckModelsModule],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService]
})
export class PricingModule {}
