import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypeEnum } from 'src/common/enums/userType';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';



@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async run() {
    await this.userRepository.save([
      {
        //admin
        //password= mypass123
        password: '$2b$12$9H6SoM2rBiEAiK1ii3INo.tCMVJ4f5ulvy3OihxKEJUqx42fQVTAG',
        phoneNumber:'+963941825567',
        isActive:1,
        fcmToken:'#',
        refreshToken:'#',
        userType:UserTypeEnum.EMPLOYEE,
        role:{id:1}
      },
      {
        //financeManagerEmployee
        //password= mypass123
        password: '$2b$12$9H6SoM2rBiEAiK1ii3INo.tCMVJ4f5ulvy3OihxKEJUqx42fQVTAG',
        phoneNumber:'+963990000000',
        isActive:1,
        fcmToken:'#',
        refreshToken:'#',
        userType:UserTypeEnum.EMPLOYEE,
        role:{id:2}
      },
      {
        //orderManagerEmployee
        //password= mypass123
        password: '$2b$12$9H6SoM2rBiEAiK1ii3INo.tCMVJ4f5ulvy3OihxKEJUqx42fQVTAG',
        phoneNumber:'+963999000000',
        isActive:1,
        fcmToken:'#',
        refreshToken:'#',
        userType:UserTypeEnum.EMPLOYEE,
        role:{id:3}
      },
      {
        //accountManagerEmployee
        //password= mypass123
        password: '$2b$12$9H6SoM2rBiEAiK1ii3INo.tCMVJ4f5ulvy3OihxKEJUqx42fQVTAG',
        phoneNumber:'+963999900000',
        isActive:1,
        fcmToken:'#',
        refreshToken:'#',
        userType:UserTypeEnum.EMPLOYEE,
        role:{id:4}
      },
      {
        //password= mypass123
        password: '$2b$12$9H6SoM2rBiEAiK1ii3INo.tCMVJ4f5ulvy3OihxKEJUqx42fQVTAG',
        phoneNumber:'+963968791246',
        isActive:1,
        fcmToken:'#',
        refreshToken:'#',
        userType:UserTypeEnum.CUSTOMER,
        role:{id:5}
      },
      {
        //password= mypass123
        password: '$2b$12$9H6SoM2rBiEAiK1ii3INo.tCMVJ4f5ulvy3OihxKEJUqx42fQVTAG',
        phoneNumber:'+963900000001',
        isActive:1,
        fcmToken:'#',
        refreshToken:'#',
        userType:UserTypeEnum.CUSTOMER,
        role:{id:5}
      },
      {
        //password= mypass123
        password: '$2b$12$9H6SoM2rBiEAiK1ii3INo.tCMVJ4f5ulvy3OihxKEJUqx42fQVTAG',
        phoneNumber:'+963900000011',
        isActive:1,
        fcmToken:'#',
        refreshToken:'#',
        userType:UserTypeEnum.CUSTOMER,
        role:{id:5}
      },
      {
        //password= mypass123
        password: '$2b$12$9H6SoM2rBiEAiK1ii3INo.tCMVJ4f5ulvy3OihxKEJUqx42fQVTAG',
        phoneNumber:'+963900000002',
        isActive:1,
        fcmToken:'#',
        refreshToken:'#',
        userType:UserTypeEnum.DRIVER,
        role:{id:6}
      },
      {
        //password= mypass123
        password: '$2b$12$9H6SoM2rBiEAiK1ii3INo.tCMVJ4f5ulvy3OihxKEJUqx42fQVTAG',
        phoneNumber:'+963900000022',
        isActive:1,
        fcmToken:'#',
        refreshToken:'#',
        userType:UserTypeEnum.DRIVER,
        role:{id:6}
      },
      {
        //password= mypass123
        password: '$2b$12$9H6SoM2rBiEAiK1ii3INo.tCMVJ4f5ulvy3OihxKEJUqx42fQVTAG',
        phoneNumber:'+963900000222',
        isActive:1,
        fcmToken:'#',
        refreshToken:'#',
        userType:UserTypeEnum.DRIVER,
        role:{id:6}
      },
    ]);
  }
}
