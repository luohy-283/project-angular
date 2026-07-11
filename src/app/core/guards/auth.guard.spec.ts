import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: authService }],
    });

    router = TestBed.inject(Router);
  });

  it('should allow access when user is logged in', () => {
    authService.isLoggedIn.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(result).toBeTrue();
  });

  it('should redirect to login when user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(result instanceof UrlTree).toBeTrue();

    if (result instanceof UrlTree) {
      expect(router.serializeUrl(result)).toBe('/login');
    }
  });
});
