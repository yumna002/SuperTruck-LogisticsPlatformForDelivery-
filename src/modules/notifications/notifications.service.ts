import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { GetFcmTokenDto } from './dto/getFcmToken.dto';
import { SendNotificationDto } from './dto/sendNotification.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import * as admin from 'firebase-admin';



@Injectable()
export class NotificationsService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly usersService: UsersService,
  ) {}
  

  async update(getFcmTokenDto:GetFcmTokenDto){
    const user=await this.usersService.getCurrentUser();

    await this.usersService.update({id:user.id,fcmToken:getFcmTokenDto.fcmToken});
  }
  
  async notify(sendNotificationDto:SendNotificationDto){
    const user=await this.usersService.getOneUserIfExist({id:sendNotificationDto.userId});

    if(user.fcmToken==='#'){
      throw new Error('error in notification');
    }

    const message = {
      notification: {
        title: sendNotificationDto.title,
        body: sendNotificationDto.body,
      }, token: user.fcmToken
    }
    
    try {
      await admin.messaging().send(message)
        .then((response) => {
          console.log("response after sending notification :>>", response)
        })
    }
    catch (error) {
      console.log('error in catch notification', error)
    }
  }
}
