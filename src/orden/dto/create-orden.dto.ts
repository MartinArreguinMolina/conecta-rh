import {IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength } from "class-validator";
import { DeviceType, OrdenStatus } from "../interfaces/orden-status.interface";

export class CreateOrdenDto {

    @IsString()
    @IsEnum(OrdenStatus)
    @IsOptional()
    status?: OrdenStatus;

    @IsOptional()
    @Min(0)
    @IsNumber()
    price?: number;
    
    @IsString()
    @IsEnum(DeviceType)
    typeDevice: DeviceType;

    @IsString()
    @MinLength(1)
    description: string;

    @IsUUID()
    clientId: string;

    @IsUUID()
    userId: string;

}
