import { IsBoolean, IsEmail, IsEnum, IsNotEmptyObject, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Roles } from "../interfaces/roles.interface";

export class CreateUserDto {
    @IsString()
    @MinLength(1)
    fullName: string;

    @IsString()
    @IsEmail()
    email: string;


    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsEnum(Roles)
    @IsString()
    @MinLength(1)
    @IsOptional()
    rol?: Roles;


    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
