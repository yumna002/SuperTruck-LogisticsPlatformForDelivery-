import { Expose, Transform } from 'class-transformer';



export class GetRecentRequestsResponseDto {
  @Expose()
  id: number;

  @Expose()
  state:string

  @Expose()
  @Transform(({ obj }) => obj.customer?.fullName ?? null)
  customerFullName: string;

  @Expose()
  @Transform(({ obj }) => obj.fromAddress?.area ?? null)
  fromAddressArea: string;

  @Expose()
  @Transform(({ obj }) => obj.toAddress?.area ?? null)
  toAddressArea: string;

}
