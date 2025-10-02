import { Expose, Transform } from 'class-transformer';



export class UpdateOrderResponseDto {
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
  @Transform(({ obj }) => obj.fromFloorNumber ?? null)
  fromFloorNumber: number;
  
  @Expose()
  @Transform(({ obj }) => obj.toFloorNumber ?? null)
  toFloorNumber: number;

  @Expose()
  note: string;

  @Expose()
  state: string;

  @Expose()
  @Transform(({ obj }) => obj.paymentType?.id ?? obj.paymentTypeId ?? null)
  paymentTypeId: number;

  @Expose()
  @Transform(({ obj }) => obj.fromAddress?.id ?? obj.fromAddressId ?? null)
  fromAddressId: number;

  @Expose()
  @Transform(({ obj }) => obj.toAddress?.id ?? obj.toAddressId ?? null)
  toAddressId: number;

  @Expose()
  @Transform(({ obj }) => obj.vehicleType?.id ?? obj.vehicleTypeId ?? null)
  vehicleTypeId: number;

  @Expose()
  @Transform(({ obj }) => obj.sizeType?.id ?? obj.sizeTypeId ?? null)
  sizeTypeId: number;

  @Expose()
  @Transform(({ obj }) => obj.photos?.map((p) => p.path) ?? [])
  photos: string[];
}
