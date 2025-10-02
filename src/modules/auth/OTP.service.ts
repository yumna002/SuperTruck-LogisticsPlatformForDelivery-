import { BadRequestException, Injectable } from '@nestjs/common';
import * as NodeCache from 'node-cache';
import { RequestOTPDto } from './dto/requestOTP.dto';
import { VerifyCodeDto } from './dto/verifyCode.dto';



@Injectable()
export class OTPService {
  private cache = new NodeCache({ stdTTL: 300 }); //5-minute TTL for OTP

  
  generateOTP(requestOTPDto:RequestOTPDto) {
    // Check if an OTP already exists
    if (this.cache.has(requestOTPDto.phoneNumber)) {
        console.log('OTP already sent. Please wait before requesting a new one.');
        throw new BadRequestException('OTP already sent. Please wait before requesting a new one.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }

  //should add error handling //future edits
  storeOTP(verifyCodeDto:VerifyCodeDto):void {
    this.cache.set(verifyCodeDto.phoneNumber, verifyCodeDto.code);
  }

  getOTP(requestOTPDto:RequestOTPDto):string|undefined {
    // Check if an OTP exists
    if (!this.cache.has(requestOTPDto.phoneNumber)) {
        console.log('Provided OTP is expired');
        throw new BadRequestException('Provided OTP is expired');
    }

    return this.cache.get(requestOTPDto.phoneNumber);
  }

  deleteOTP(phoneNumber: string):void {
    this.cache.del(phoneNumber);
  }
}
