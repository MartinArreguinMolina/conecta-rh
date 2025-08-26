import { SetMetadata } from "@nestjs/common";
import { Roles } from "src/auth/interfaces/roles.interface";


export const META_ROLES = 'roles';

export const RoleProtected = (...args: Roles[]) => {

    return SetMetadata(META_ROLES, args)
}