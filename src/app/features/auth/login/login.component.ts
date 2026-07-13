import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, PageTitleComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  authError = '';
  isSubmitting = false;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.isSubmitting = true;
    this.authError = '';

    this.authService
      .login(username, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (isAuthenticated) => {
          this.isSubmitting = false;

          if (!isAuthenticated) {
            this.authError = 'Tên đăng nhập hoặc mật khẩu không đúng.';
            this.loginForm.markAllAsTouched();
            return;
          }

          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.isSubmitting = false;
          this.authError = 'Tên đăng nhập hoặc mật khẩu không đúng.';
          this.loginForm.markAllAsTouched();
        },
      });
  }
}
