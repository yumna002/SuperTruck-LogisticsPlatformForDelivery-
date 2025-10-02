import { forwardRef, Module } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';
import { HttpModule } from '@nestjs/axios';



@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [GoogleMapsService],
  exports: [GoogleMapsService]
})
export class GoogleMapsModule {}
