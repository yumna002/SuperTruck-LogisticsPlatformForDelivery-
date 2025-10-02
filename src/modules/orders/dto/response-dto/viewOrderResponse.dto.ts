import { ClassTransformOptions, Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { FindOneItemResponseDto } from 'src/modules/items/dto/response-dto/findOneItemResponse.dto';



export class ViewOrderResponseDto {
  @Expose()
  id: number;

  @Expose()
  orderDateTime: Date;

  @Expose()
  fromPhoneNumber: string;

  @Expose()
  toPhoneNumber: string;

  @Expose()
  isScheduled: number;

  @Expose()
  fromHaveLift: number;

  @Expose()
  toHaveLift: number;

  @Expose()
  needHolders: number;

  @Expose()
  fromFloorNumber: number;
  
  @Expose()
  toFloorNumber: number;

  @Expose()
  state: string;

  @Expose()
  note: string;

  @Expose()
  customerId: number;

  @Expose()
  @Transform(({ obj }) => obj.customer?.fullName ?? null)
  customerFullName: string;

  @Expose()
  fromAddressId: number;

  @Expose()
  @Transform(({ obj }) => obj.fromAddress?.area ?? null)
  fromAddressArea: string;

  @Expose()
  @Transform(({ obj }) => obj.fromAddress?.name ?? null)
  fromAddressName: string;

  @Expose()
  @Transform(({ obj }) => obj.toAddress?.name ?? null)
  toAddressName: string;

  @Expose()
  @Transform(({ obj }) => obj.photos?.map((p) => p.path) ?? [])
  photos: string[];

  @Expose()
  toAddressId: number;

  @Expose()
  @Transform(({ obj }) => obj.toAddress?.area ?? null)
  toAddressArea: string;

  @Expose()
  vehicleTypeId: number;
  
  @Expose()
  sizeTypeId: number;

  @Expose()
  paymentTypeId: number;

  @Expose()
  @Transform(({ obj, options }) => {
    const lang = (options as any).context?.lang || 'en';
    return lang === 'ar'
      ? obj.vehicleType?.name_ar ?? null
      : obj.vehicleType?.name_en ?? null;
  })
  vehicleTypeName: string;
  
  @Expose()
  @Transform(({ obj, options }) => {
    const lang = (options as any).context?.lang || 'en';
    return lang === 'ar'
      ? obj.sizeType?.name_ar ?? null
      : obj.sizeType?.name_en ?? null;
  })
  sizeTypeName: string;

  @Expose()
  @Transform(({ obj, options }) => {
    const lang = (options as any).context?.lang || 'en';
    return lang === 'ar'
      ? obj.paymentType?.name_ar ?? null
      : obj.paymentType?.name_en ?? null;
  })
  paymentTypeName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  //Items array
  @Expose()
  @Transform(({ obj, options }) =>{
    const lang = (options as any).context?.lang || 'en';
    return obj.items
      ? obj.items.map(item =>
          plainToInstance(FindOneItemResponseDto, item, { excludeExtraneousValues: true,
              context: { lang },
            } as ClassTransformOptions & { context?: any }
          )
        )
      : []
  })
  items: FindOneItemResponseDto[];
}
