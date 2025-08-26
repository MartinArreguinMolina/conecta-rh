import {IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength } from "class-validator";
import { OrdenStatus } from "../interfaces/orden-status.interface";

export class CreateOrdenDto {

    @IsString()
    @IsEnum(OrdenStatus)
    @IsOptional()
    ordenStatus?: OrdenStatus;

    @IsOptional()
    @Min(0)
    @IsNumber()
    price?: number;
    
    @IsString()
    @MinLength(1)
    typeDevice: string;

    @IsString()
    @MinLength(1)
    description: string;

    @IsUUID()
    clientId: string;

    @IsUUID()
    userId: string;

}
