import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateClientDto {

    @IsString()
    @MinLength(1)
    fullName: string;

    @IsString()
    @MinLength(10)
    address: string;

    @IsString()
    @Matches(/^(?:\+?52\s?)?(?:\(?\d{2}\)?[\s.-]?\d{4}[\s.-]?\d{4}|\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})$/, {
        message: 'Numero de telefono invalido'
    })
    phoneNumber: string;


    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string
}
