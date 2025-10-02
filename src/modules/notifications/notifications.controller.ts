import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { GetFcmTokenDto } from './dto/getFcmToken.dto';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SendNotificationDto } from './dto/sendNotification.dto';



@UseGuards(AuthGuard,RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.DRIVER,RoleTypeEnum.CUSTOMER)
  @Post('/getFcmToken')
  async getFcmToken(@Body() getFcmTokenDto:GetFcmTokenDto){
    const notify=await this.notificationsService.update(getFcmTokenDto);
    return {notify:notify};
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.DRIVER,RoleTypeEnum.CUSTOMER)
  @Post('/sendNotification')
  async sendNotification(@Body() sendNotificationDto:SendNotificationDto){
    await this.notificationsService.notify(sendNotificationDto);
  }
}
