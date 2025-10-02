import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SendMessageDto } from './dto/send-message.dt';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { GetQrDto } from './dto/get-qr.dto';
import { toDataURL } from 'qrcode'
import * as fs from 'fs';
import path from 'path';



interface SessionInfo { //This is the definition of SessionInfo
  client: Client;
  qr?: string;
}


@Injectable()
export class WhatsappService implements OnModuleInit{
  private sessions: Record<string, SessionInfo> = {};


  async onModuleInit() {
    if (!this.sessions["number1"]) {
      await this.createSession({id:"number1"}); //No QR will be required; it will resume
    }
  }

  async createSession(createSessionDto: CreateSessionDto) {
    if (this.sessions[createSessionDto.id]) 
      return {}

    const client =new Client({
      authStrategy: new LocalAuth({ clientId: createSessionDto.id }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.sessions[createSessionDto.id] = { client };

    client.on('qr', async (qr) => {
      this.sessions[createSessionDto.id].qr = qr;
    });

    client.on('authenticated', () => {
      console.log('✅ Authenticated with WhatsApp!');
    });

    client.on('ready', () => {
      console.log(`Client ${createSessionDto.id} is ready!`);
    });

    client.on('auth_failure', (msg) => {
      console.error('❌ Authentication failed:', msg);
    });

    client.on('disconnected',async (reason) => {
      console.log(`Client ${createSessionDto.id} disconnected: ${reason}`);
      //await this.deleteSession({id:createSessionDto.id})
    });
      
    await client.initialize();

    return {};
  }

  async getQR(getQrDto:GetQrDto) {
    //get the session for the given id
    const session=this.sessions[getQrDto.id];
    console.log(session)
    if(!session){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException)
    }
    if(!session.qr){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException)
    }

    //change qr from string to image
    const qrImage=await toDataURL(session.qr)

    return {qr:qrImage};
  }

  async sendMessage(sendMessageDto:SendMessageDto) {
    const session=this.sessions[sendMessageDto.id];
    if(!session){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException)
    }
    const client=session.client;
    if(!client){
      throw new Error(I18nKeys.exceptionMessages.clientNotReadyException)
    }

    const wpNumber = await client.getNumberId(sendMessageDto.recieverNumber); // returns null if number is invalid
    if (!wpNumber) {
      throw new Error(I18nKeys.exceptionMessages.noWhatsappException);
    }

    try{
      await client.sendMessage(`${wpNumber.user}@${wpNumber.server}`, sendMessageDto.message);
    }catch(error){
      console.log('error from sending message',error)
    }

    return {};
  }

  async deleteSession(createSessionDto:CreateSessionDto) {
    const session=this.sessions[createSessionDto.id];
    if(!session){
      return{}
    }
    const client=session.client;
    if(!client){
      return {}
    }

    // Step 1: Properly destroy the client session
    await session.client.destroy();

    // Step 2: Remove local session folder
    fs.rmSync(`.wwebjs_auth/session-${createSessionDto.id}`, { recursive: true, force: true });

    // Step 3: Remove from memory
    delete this.sessions[createSessionDto.id];

    return {};
  }
}
