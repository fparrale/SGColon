import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PasswordResetService } from '../../../../core/services/password-reset.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-password-reset-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterLink],
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.css']
})
export class PasswordResetRequestComponent {
  resetForm: FormGroup;
  isLoading = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService,
    private notification: NotificationService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) return;

    this.isLoading.set(true);
    const email = this.resetForm.value.email;

    this.passwordResetService.requestReset(email).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.ok) {
          const message = this.translate.instant('passwordReset.request.success');
          this.notification.success(message, 5000);
          this.router.navigate(['/admin/password-reset/verify']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Request reset error:', error);

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
          errorMsg = this.translate.instant('passwordReset.request.error');
        }

        this.notification.error(errorMsg, 6000);
      }
    });
  }
}
