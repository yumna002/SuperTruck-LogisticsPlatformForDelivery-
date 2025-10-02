import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { IsNotEmptyT, IsNumberT } from 'src/common/decorators/customValidators.decorator';
import { I18nKeys } from 'src/common/i18n/i18n-keys';

export class CreateTryDto {
  @Type(() => Number)
  @IsNumberT()
  @IsNotEmptyT()
  info: number;
}
