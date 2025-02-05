import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting
  const currentUrl = window.location.pathname;
  if (currentUrl !== '/auth/login') {
    localStorage.setItem('redirectUrl', currentUrl);
  }
  
  router.navigate(['/auth/login']);
  return false;
};