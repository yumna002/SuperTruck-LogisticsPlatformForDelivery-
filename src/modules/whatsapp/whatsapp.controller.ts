import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SendMessageDto } from './dto/send-message.dt';
import { I18nService } from 'nestjs-i18n';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { GetQrDto } from './dto/get-qr.dto';



@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly i18n: I18nService,
  ) {}


  @Post('createSession')
  async createSession(@Body() createSession: CreateSessionDto) {
    const data= await this.whatsappService.createSession(createSession);
    return {
      data: data,
        message: I18nKeys.successMessages.createSessionSuccess
    }
  }

  @Post('qr')
  async getQR(@Body() getQrDto:GetQrDto) {
    const data=await this.whatsappService.getQR(getQrDto);
    return {
      data: data,
      message: I18nKeys.successMessages.getQrSuccess
    }
  }

  @Post('sendMessage')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    const data=this.whatsappService.sendMessage(sendMessageDto);
    return {
      data: data,
      message: I18nKeys.successMessages.sendMessageSuccess
    }
  }

  @Post('deleteSession')
  async deleteSession(@Body() createSessionDto:CreateSessionDto){
    const data=await this.whatsappService.deleteSession(createSessionDto);
    return {
      data: data,
      message: "session deleted successfully"
    }
  }
}
