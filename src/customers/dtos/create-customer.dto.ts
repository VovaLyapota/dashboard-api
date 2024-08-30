import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { dateFormatRegex } from 'src/suppliers/dtos/create-supplier.dto';

export const phoneNumberRegex = /^\+\d{12}$/;

export class CreateCustomerDto {
  @IsOptional()
  @IsString()
  image: string | null;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  spent: number;

  @Matches(phoneNumberRegex, {
    message:
      'Phone number must be in the format +XXXXXXXXXXXX (e.g., +380703703703)',
  })
  phone: string;

  @IsString()
  address: string;

  @Matches(dateFormatRegex)
  registeredAt: string;
}
