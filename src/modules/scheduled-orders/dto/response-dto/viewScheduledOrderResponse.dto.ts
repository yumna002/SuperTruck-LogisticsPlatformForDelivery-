import { ClassTransformOptions, Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { FindOneItemResponseDto } from 'src/modules/items/dto/response-dto/findOneItemResponse.dto';



export class ViewScheduledOrderResponseDto {
  @Expose()
  id: number; 

  @Expose()
  driverId: number;

  @Expose()
  @Transform(({ obj }) => obj.driver ? `${obj.driver.firstName} ${obj.driver.lastName}` : null)
  driverFullName: string;

  @Expose()
  orderId: number;
  
  @Expose()
  expectedPrice:number

  @Expose()
  @Transform(({ obj }) => obj.order?.orderDateTime ?? null)
  orderDateTime: Date;

  @Expose()
  @Transform(({ obj }) => obj.order?.fromPhoneNumber ?? null)
  fromPhoneNumber: string;

  @Expose()
  @Transform(({ obj }) => obj.order?.toPhoneNumber ?? null)
  toPhoneNumber: string;

  @Expose()
  @Transform(({ obj }) => obj.order?.isScheduled ?? null)
  isScheduled: number;

  @Expose()
  @Transform(({ obj }) => obj.order?.fromHaveLift ?? null)
  fromHaveLift: number;
  
  @Expose()
  @Transform(({ obj }) => obj.order?.toHaveLift ?? null)
  toHaveLift: number;

  @Expose()
  @Transform(({ obj }) => obj.order?.needHolders ?? null)
  needHolders: number;

  @Expose()
  @Transform(({ obj }) => obj.order?.fromFloorNumber ?? null)
  fromFloorNumber: number;
  
  @Expose()
  @Transform(({ obj }) => obj.order?.toFloorNumber ?? null)
  toFloorNumber: number;

  @Expose()
  @Transform(({ obj }) => obj.order?.state ?? null)
  orderState: string;

  @Expose()
  @Transform(({ obj }) => obj.order?.note ?? null)
  note: string;

  @Expose()
  @Transform(({ obj }) => obj.order?.customerId ?? null)
  customerId: number;

  @Expose()
  @Transform(({ obj }) => obj.order?.customer?.fullName ?? null)
  customerFullName: string;

  @Expose()
  @Transform(({ obj }) => obj.order?.fromAddressId ?? null)
  fromAddressId: number;

  @Expose()
  @Transform(({ obj }) => obj.order?.fromAddress?.area ?? null)
  fromAddressArea: string;

  @Expose()
  @Expose()
  @Transform(({ obj }) => obj.order?.fromAddress?.name ?? null)
  fromAddressName: string;

  @Expose()
  @Transform(({ obj }) => obj.order?.toAddress?.name ?? null)
  toAddressName: string;

  @Expose()
  @Transform(({ obj }) => obj.driver?.user?.phoneNumber ?? null)
  driverPhoneNumber: string;

  @Expose()
  @Transform(({ obj }) => obj.order.photos?.map((p) => p.path) ?? [])
  photos: string[];

  @Expose()
  @Transform(({ obj }) => obj.order?.toAddressId ?? null)
  toAddressId: number;

  @Expose()
  @Transform(({ obj }) => obj.order?.toAddress?.area ?? null)
  toAddressArea: string;

  @Expose()
  @Transform(({ obj }) => obj.order?.vehicleTypeId ?? null)
  vehicleTypeId: number;

  @Expose()
  @Transform(({ obj }) => obj.order?.sizeTypeId ?? null)
  sizeTypeId: number;

  @Expose()
  @Transform(({ obj }) => obj.order?.paymentTypeId ?? null)
  paymentTypeId: number;

  @Expose()
  @Transform(({ obj, options }) => {
    const lang = (options as any).context?.lang || 'en';
    return lang === 'ar'
      ? obj.order?.vehicleType?.name_ar ?? null
      : obj.order?.vehicleType?.name_en ?? null;
  })
  vehicleTypeName: string;

  @Expose()
  @Transform(({ obj, options }) => {
    const lang = (options as any).context?.lang || 'en';
    return lang === 'ar'
      ? obj.order?.sizeType?.name_ar ?? null
      : obj.order?.sizeType?.name_en ?? null;
  })
  sizeTypeName: string;

  @Expose()
  @Transform(({ obj, options }) => {
    const lang = (options as any).context?.lang || 'en';
    return lang === 'ar'
      ? obj.order?.paymentType?.name_ar ?? null
      : obj.order?.paymentType?.name_en ?? null;
  })
  paymentTypeName: string;

  @Expose()
  @Transform(({ obj }) => obj.order?.createdAt ?? null)
  orderCreatedAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.order?.updatedAt ?? null)
  orderUpdatedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;


  @Expose()
  @Transform(({ obj }) => {
    const orderDateTime = obj.order?.orderDateTime;
    if (!orderDateTime) return false;

    const now = new Date();
    const scheduledTime = new Date(orderDateTime);
    const diffInMs = Math.abs(now.getTime() - scheduledTime.getTime());
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours <= 2;
  })
  isNearToScheduledTime: boolean;


  //Items array
  @Expose()
    @Transform(({ obj, options }) =>{
      const lang = (options as any).context?.lang || 'en';
      return obj.order?.items
        ? obj.order.items.map(item =>
            plainToInstance(FindOneItemResponseDto, item, { excludeExtraneousValues: true,
                context: { lang },
              } as ClassTransformOptions & { context?: any }
            )
          )
        : []
    })
    items: FindOneItemResponseDto[];
}
