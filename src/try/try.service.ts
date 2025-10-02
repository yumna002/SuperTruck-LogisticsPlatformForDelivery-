import { Injectable } from '@nestjs/common';
import { CreateTryDto } from './dto/create-try.dto';

@Injectable()
export class TryService {
  
  create(body: CreateTryDto) {
    console.log(body)
    return body.info;
  }
  
}
