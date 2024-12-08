import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ROLES_KEY } from "./roles.decorator";
import { Reflector } from "@nestjs/core";
import { Role } from "./role.enum";

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.rol) {
      return false;  // Si no hay rol, denegar acceso
    }
    
    return requiredRoles.some((role) => user.rol.rol === role);
  }
}
