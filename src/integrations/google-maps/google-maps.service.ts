import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';




@Injectable()
export class GoogleMapsService {
    private readonly apiKey = process.env.apiKey;

    constructor(
        private readonly http: HttpService,
    ) {}

  
  async getTimeAndDistace(origin:string,destination:string) {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${this.apiKey}`;

    const { data }:any = await axios.get(url);

    if (data.status !== 'OK') {
      throw new Error(`Google API error: ${data.status}`);
    }

    return data;
  }
}
