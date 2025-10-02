import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Role } from 'src/modules/users/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';



@Injectable()
export class RoleSeeder {
  constructor(
    @InjectRepository(Role) private customerRepository: Repository<Role>,
  ) {}

  async run() {
    await this.customerRepository.save([
      {
        name:RoleTypeEnum.ADMIN,
      },
      {
        name:RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,
      },
      {
        name:RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,
      },
      {
        name:RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,
      },
      {
        name:RoleTypeEnum.CUSTOMER,
      },
      {
        name:RoleTypeEnum.DRIVER,
      },
    ]);
  }
}
