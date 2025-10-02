import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';



@Injectable()
export class CustomerSeeder {
  constructor(
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
  ) {}

  async run() {
    await this.customerRepository.save([
      {
        fullName:'sama',
        email:'sama11@gmail.com',
        user:{id:5},
        birthdate:'1998-07-15 00:00:00'
      },
      {
        fullName:'samara',
        email:'samara11@gmail.com',
        user:{id:6},
        birthdate:'1998-07-15 00:00:00'
      },
      {
        fullName:'alaa',
        email:'alaa11@gmail.com',
        user:{id:7},
        birthdate:'1998-07-15 00:00:00'
      },
    ]);
  }
}
