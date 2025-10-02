import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsEnumT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';
import { Order } from 'src/modules/orders/entities/order.entity';
import { SendOrderRequestDto } from 'src/modules/orders/dto/sendOrderRequest.dto';



export class AddNewOrderDto {
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    orderId: number;

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    latitude: number;

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    longitude: number;

    order:Order;

    sendOrderRequestDto:SendOrderRequestDto;
}
