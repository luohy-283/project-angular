import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.resolveTo(true);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep form invalid and mark controls as touched when submitted empty', () => {
    component.onSubmit();

    expect(component.loginForm.invalid).toBeTrue();
    expect(component.loginForm.controls.username.touched).toBeTrue();
    expect(component.loginForm.controls.password.touched).toBeTrue();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate to dashboard when credentials are valid', () => {
    authService.login.and.returnValue(true);
    component.loginForm.setValue({ username: 'admin', password: 'admin' });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledOnceWith('admin', 'admin');
    expect(component.authError).toBe('');
    expect(router.navigate).toHaveBeenCalledOnceWith(['/dashboard']);
  });

  it('should show an error and stay on login page when credentials are invalid', () => {
    authService.login.and.returnValue(false);
    component.loginForm.setValue({ username: 'wrong', password: 'wrong' });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledOnceWith('wrong', 'wrong');
    expect(component.authError).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
