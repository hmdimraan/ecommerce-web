import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  const token =
    authService.getToken();

  if (!token) {

    router.navigate(
      ['/login']
    );

    return false;
  }

  const role =
    authService.getRole();

  if (
    authService.isLoggedIn() &&
    role?.toLowerCase() === 'admin'
  ) {
    return true;
  }

  router.navigate(
    ['/products']
  );

  return false;
};