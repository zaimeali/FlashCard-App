import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Routes } from './constants/routes';
import { AuthService } from '../../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for authentication loading to complete
  if (authService.isLoading()) {
    await firstValueFrom(
      toObservable(authService.isLoading).pipe(
        filter(isLoading => !isLoading)
      )
    );
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.navigate([`/${Routes.LOGIN}`]);
};

// Guard to prevent authenticated users from accessing login page
export const loginGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for authentication loading to complete
  if (authService.isLoading()) {
    await firstValueFrom(
      toObservable(authService.isLoading).pipe(
        filter(isLoading => !isLoading)
      )
    );
  }

  // If already authenticated, redirect to home
  if (authService.isAuthenticated()) {
    return router.navigate([`/${Routes.HOME}`]);
  }

  return true;
};
