import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PasswordResetService } from '../../../../core/services/password-reset.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-password-reset-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './password-reset-new.component.html',
  styleUrls: ['./password-reset-new.component.css']
})
export class PasswordResetNewComponent implements OnInit {
  passwordForm: FormGroup;
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  private code: string = '';

  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService,
    private notification: NotificationService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      if (!this.code) {
        this.router.navigate(['/admin/password-reset/request']);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { mismatch: true };
    }
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.passwordForm.invalid || !this.code) return;

    this.isLoading.set(true);
    const newPassword = this.passwordForm.value.password;

    this.passwordResetService.resetPassword(this.code, newPassword).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.ok) {
          const message = this.translate.instant('passwordReset.new.success');
          this.notification.success(message, 5000);
          setTimeout(() => {
            this.router.navigate(['/admin/login']);
          }, 2000);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Reset password error:', error);

        let errorMsg = '';

        if (error.error) {
          if (typeof error.error === 'string') {
            errorMsg = error.error;
          } else if (error.error.error) {
            errorMsg = error.error.error;
          } else if (error.error.message) {
            errorMsg = error.error.message;
          }
        }

        if (!errorMsg) {
          errorMsg = this.translate.instant('passwordReset.new.error');
        }

        this.notification.error(errorMsg, 4000);
      }
    });
  }
}
