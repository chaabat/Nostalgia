import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.getToken()) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (!authService.isAdmin()) {
    router.navigate(['/user/home']);
    return false;
  }

  return true;
}; 