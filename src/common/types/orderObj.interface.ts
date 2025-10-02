import { SendOrderRequestDto } from "src/modules/orders/dto/sendOrderRequest.dto";
import { Order } from "src/modules/orders/entities/order.entity";



export interface OrderObj {
  numberOfAttempts: number;
  timeStamp: Date;
  orderId: number;
  order: Order;
  sendOrderRequestDto: SendOrderRequestDto;
  geoHash: string;
  rejectedDrivers: number[];
}
