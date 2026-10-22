import {
  IsEmail, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl,
   Max, MaxLength, Min, MinLength, } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  // plain lozinka - hash se pravi u AuthService pre cuvanja u passwordHash
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(72) // bcrypt ignorise sve preko 72 bajta
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  lastName: string;

  @IsInt()
  @IsNotEmpty()
  @Min(16)
  @Max(120)
  age: number;

  @IsOptional()
  @IsPhoneNumber('RS')
  phone?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
