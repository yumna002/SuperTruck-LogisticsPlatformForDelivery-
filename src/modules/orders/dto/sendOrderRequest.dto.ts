import { Expose, Transform, Type } from 'class-transformer';
import { FindOneItemResponseDto } from 'src/modules/items/dto/response-dto/findOneItemResponse.dto';



export class SendOrderRequestDto {
  @Expose()
  @Transform(({ obj }) => obj.order?.fromAddress?.area)
  fromArea: string;

  @Expose()
  @Transform(({ obj }) => obj.order?.fromAddress?.city)
  fromCity: string;

  @Expose()
  @Transform(({ obj }) => obj.order?.toAddress?.area)
  toArea: string;

  @Expose()
  @Transform(({ obj }) => obj.order?.toAddress?.city)
  toCity: string;

  @Expose()
  @Transform(({ obj }) => obj.confirmOrder.distance)
  distance: number;

  @Expose()
  @Transform(({ obj }) => obj.confirmOrder.expectedTime)
  expectedTime: number;

  @Expose()
  @Transform(({ obj }) => obj.confirmOrder.expectedPrice)
  expectedPrice: number;

  @Expose()
  @Transform(({ obj }) => obj.confirmOrder.holdersProfit)
  holdersProfit: number;

  @Expose()
  @Transform(({ obj }) => obj.confirmOrder.driverProfit)
  driverProfit: number;

  @Expose()
  @Transform(({ obj }) => obj.order?.id)
  orderId: number;

  @Expose()
  @Transform(({ obj }) => obj.order?.isScheduled)
  isScheduled:number

  @Expose()
  driverId?:number

  @Expose()
  customerId?:number
}
