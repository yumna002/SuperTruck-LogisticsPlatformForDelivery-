import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { UsersModule } from '../users/users.module';
import { TokenService } from 'src/shared/utils/tokenFunctions';
import { AddressesModule } from '../addresses/addresses.module';
import { AuthModule } from '../auth/auth.module';
import { CustomerGateway } from './customer.gateway';



@Module({
  imports: [AuthModule, UsersModule, AddressesModule, TypeOrmModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [CustomersService,CustomerGateway],
  exports: [CustomersService,CustomerGateway]
})
export class CustomersModule {}
