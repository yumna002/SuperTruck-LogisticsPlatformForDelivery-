import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenderEnum } from 'src/common/enums/gender';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';



@Injectable()
export class EmployeeSeeder {
  constructor(
    @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
  ) {}

  async run() {
    await this.employeeRepository.save([
      {
        //admin
        firstName:'yumna',
        lastName:'a',
        fatherName:'a',
        address:'a',
        gender:GenderEnum.FEMALE,
        email:'yumna11@gmail.com',
        birthdate:'1998-07-15 00:00:00',
        user:{id:1},
      },
      {
        //financeManagerEmployee
        firstName:'dana',
        lastName:'a',
        fatherName:'a',
        address:'a',
        gender:GenderEnum.FEMALE,
        email:'dana11@gmail.com',
        birthdate:'1998-07-15 00:00:00',
        user:{id:2},
      },
      {
        //orderManagerEmployee
        firstName:'rami',
        lastName:'a',
        fatherName:'a',
        address:'a',
        gender:GenderEnum.MALE,
        email:'rami11@gmail.com',
        birthdate:'1998-07-15 00:00:00',
        user:{id:3},
      },
      {
        //accountManagerEmployee
        firstName:'sidra',
        lastName:'a',
        fatherName:'a',
        address:'a',
        gender:GenderEnum.FEMALE,
        email:'sidra11@gmail.com',
        birthdate:'1998-07-15 00:00:00',
        user:{id:4},
      },
    ]);
  }
}
