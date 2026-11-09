import { IsString, IsEmail, MinLength, IsIn, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'نام کاربری باید حداقل ۳ کاراکتر باشد.' })
  username: string;

  @IsEmail({}, { message: 'ایمیل وارد شده معتبر نیست.' })
  email: string;

  @IsString()
  @MinLength(2, { message: 'نام نمایشی باید حداقل ۲ کاراکتر باشد.' })
  displayName: string;

  @IsString()
  @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد.' })
  password: string;

  @IsIn(['boy', 'girl'], { message: 'جنسیت باید مشخص شود (پسر یا دختر).' })
  gender: 'boy' | 'girl';

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class LoginDto {
  @IsString({ message: 'نام کاربری یا ایمیل الزامی است.' })
  identifier: string;

  @IsString({ message: 'رمز عبور الزامی است.' })
  password: string;

  @IsOptional()
  rememberMe?: boolean;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsIn(['boy', 'girl'])
  gender?: 'boy' | 'girl';
}
