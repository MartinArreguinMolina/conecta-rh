import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ){}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    if(!validRoles) return true;
    if(validRoles.length === 0) return true;

    const rep = context.switchToHttp().getRequest()
    const user = rep.user as User

    if(!user)
      throw new BadRequestException('EL usuario no existe')


    if(validRoles.includes(user.rol))
      return true;

    throw new ForbiddenException(
      `Usuario con el nombre ${user.fullName} necesita un rol valido ${validRoles}`
    )


  }
}
