import { Matches, Length, IsNumber, ValidationOptions, IsNotEmpty, IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { I18nKeys } from 'src/common/i18n/i18n-keys';



export function NationalNumberRuleT() {
  return function(object:Object,propertyName:string){
    Matches(/^\d+$/, {message:I18nKeys.validationMessages.nationalNumberRule})(object,propertyName);
  };
}

export function PhoneNumberRuleT() {
  return function(object:Object,propertyName:string){
    Matches(/^\+9639\d{8}$/, {message:I18nKeys.validationMessages.phoneNumberRule})(object,propertyName);
    Length(13, 13, {message:I18nKeys.validationMessages.phoneNumberRule})(object,propertyName);
  };
}

export function AccountPasswordRuleT() {
  return function(object:Object,propertyName:string){
    Matches(
      /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      {message:I18nKeys.validationMessages.accountPasswordRule},
    )(object,propertyName);
    Length(8,undefined,{message:I18nKeys.validationMessages.accountPasswordRule})(object,propertyName);
  };
}

export function IsNumberT(
  options?: Parameters<typeof IsNumber>[0],
  validationOptions?: ValidationOptions,
) {
  return IsNumber(options || {}, {
    message: I18nKeys.validationMessages.isNumber,
    ...validationOptions,
  });
}

export function IsNotEmptyT(validationOptions?: ValidationOptions) {
  return IsNotEmpty({
    message: I18nKeys.validationMessages.isNotEmpty,
    ...validationOptions,
  });
}

export function IsStringT(validationOptions?: ValidationOptions) {
  return IsString({
    message: I18nKeys.validationMessages.isString,
    ...validationOptions,
  });
}

export function IsEmailT(
  options?: Parameters<typeof IsEmail>[0], // IsEmailOptions
  validationOptions?: ValidationOptions,
) {
  return IsEmail(options || {}, {
    message: I18nKeys.validationMessages.isEmail,
    ...validationOptions,
  });
}

export function IsEnumT(entityEnum: object, validationOptions?: ValidationOptions) {
  return IsEnum(entityEnum, {
    message: I18nKeys.validationMessages.isEnum,
    ...validationOptions,
  });
}

export function IsOptionalT(validationOptions?: ValidationOptions) {
  return IsOptional({
    message: I18nKeys.validationMessages.isOptional,
    ...validationOptions,
  });
}
