import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('User in RolesGuard:', user);

    if (!user || !user.role) {
      throw new ForbiddenException('User or role not found in request');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`${user.role}:  You do not have access to this resource.`);
    }
    //console.log('User role:', user.role);
    //console.log('Required roles:', requiredRoles);
    return true; 
  }
}