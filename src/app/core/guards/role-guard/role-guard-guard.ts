import { CanActivateFn, Router } from '@angular/router';
import { Payload } from '../../interfaces/payload/payload-structure.interface';
import { jwtDecode } from 'jwt-decode';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const token: string | null = localStorage.getItem('token');
  const router = inject(Router);

  const payload: Payload = jwtDecode(token!);

  const requiredRoles = (route.data?.['roles'] as string[]) || [];

  if (!requiredRoles.includes(payload.role) && requiredRoles.length) {
    router.navigateByUrl('');
    return false;
  }

  return true;
};
