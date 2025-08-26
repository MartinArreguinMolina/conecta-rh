import { applyDecorators, UseGuards } from "@nestjs/common";
import { Roles } from "../interfaces/roles.interface";
import { AuthGuard } from "@nestjs/passport";
import { RoleProtected, UserRoleGuard } from "./index";

export function Auth(...roles: Roles[]){
    return applyDecorators(
        RoleProtected(...roles),
        // Se manda con () a un Guard que no es nuestro
        UseGuards(AuthGuard(), UserRoleGuard)
    )
}