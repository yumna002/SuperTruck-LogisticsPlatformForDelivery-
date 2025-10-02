import { Expose, Transform } from "class-transformer";
export class GetDriverOrdersPaymentListDto{
    @Expose()
    orderId: number;

    @Expose()
    @Transform(({ obj }) => obj.order.paymentType.name_en === 'cash' ? 'Pay' : 'Receive')
    type: string;

    @Expose()
    @Transform(({ obj }) => {
    const isCash = obj.order.paymentType.name_en === 'cash';
    const driver = obj.finalDriverPrice || 0;
    const holder = obj.finalHolderPrice || 0;
    const final = obj.finalPrice || 0;

    return isCash ? final - (driver + holder) : driver + holder;
    })
    amount: number;

}