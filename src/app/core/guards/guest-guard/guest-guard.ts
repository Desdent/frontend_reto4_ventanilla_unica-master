import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const token: string | null = localStorage.getItem('token');
  const router = inject(Router);

  if (token) {
    router.navigateByUrl('dashboard');
    return false;
  }

  return true;
};
