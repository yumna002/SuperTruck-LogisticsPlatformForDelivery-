import { Expose, Transform } from 'class-transformer';

export class GetTruckOptionsResponseDto {
  @Expose()
  sizeTypeId: number;

  @Expose()
  vehicleTypeId: number;

  @Expose()
  @Transform(({ obj, options }) => {
    const lang = (options as any)?.context?.lang || 'en';
    return obj[`sizeTypeName_${lang}`];
  })
  sizeTypeName: string;

  @Expose()
  @Transform(({ obj, options }) => {
    const lang = (options as any)?.context?.lang || 'en';
    return obj[`vehicleTypeName_${lang}`];
  })
  vehicleTypeName: string;
}
