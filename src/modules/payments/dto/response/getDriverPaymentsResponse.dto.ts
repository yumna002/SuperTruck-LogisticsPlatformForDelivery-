import { Expose, Transform } from "class-transformer";

export class GetDriverPaymentsResponseDto{
    @Expose()
    orderId: number;

    @Expose()
    finalPrice:number;

    @Expose()
    @Transform(({ obj }) => obj.order.paymentType.name_en)
    paymentMethod:string

    @Expose()
    @Transform(({ obj }) => obj.order.paymentType.name_en === 'cash' ? 'Pay' : 'Receive')
    type: string;


    @Expose()
    @Transform(({ obj }) => obj.finalDriverPrice || 0)
    driverEarnings: number;

    
    @Expose()
    @Transform(({ obj }) => {
    const driver = obj.finalDriverPrice || 0;
    const holder = obj.finalHolderPrice || 0;
    const final = obj.finalPrice || 0;

    return final - (driver + holder) ;
    })
    companyProfit: number;

    @Expose()
    @Transform(({ obj }) => obj.finalHolderPrice)
    holdersEarnings:number;

    @Expose()
    @Transform(({ obj }) => {
        const isCash = obj.order.paymentType.name_en === 'cash';
        const driver = obj.finalDriverPrice || 0;
        const holder = obj.finalHolderPrice || 0;
        const final = obj.finalPrice || 0;

        return isCash ? final - (driver + holder) : driver + holder;
    })
    amount:number

    @Expose()
    isPaid:number
}