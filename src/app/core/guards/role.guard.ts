import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as 'ADMIN' | 'USER' | undefined;

  if (!requiredRole) {
    return true;
  }

  if (authService.getCurrentRole() === requiredRole) {
    return true;
  }

  return router.createUrlTree(['/403'], { queryParams: { redirectTo: state.url } });
};
