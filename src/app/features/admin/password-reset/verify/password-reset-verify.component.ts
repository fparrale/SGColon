import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PasswordResetService } from '../../../../core/services/password-reset.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-password-reset-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterLink],
  templateUrl: './password-reset-verify.component.html',
  styleUrls: ['./password-reset-verify.component.css']
})
export class PasswordResetVerifyComponent implements OnInit, OnDestroy {
  verifyForm: FormGroup;
  isLoading = signal<boolean>(false);
  timeRemaining = signal<number>(60); // 1 minuto en segundos
  private timerInterval?: number;

  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService,
    private notification: NotificationService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startTimer(): void {
    this.timerInterval = window.setInterval(() => {
      const remaining = this.timeRemaining() - 1;
      this.timeRemaining.set(remaining);

      if (remaining <= 0) {
        this.stopTimer();
        const message = this.translate.instant('passwordReset.verify.expired');
        this.notification.error(message, 5000);
        this.router.navigate(['/admin/password-reset/request']);
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  onSubmit(): void {
    if (this.verifyForm.invalid) return;

    this.isLoading.set(true);
    const code = this.verifyForm.value.code;

    this.passwordResetService.verifyCode(code).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.ok && response.valid) {
          const message = this.translate.instant('passwordReset.verify.success');
          this.notification.success(message, 3000);
          this.stopTimer();
          this.router.navigate(['/admin/password-reset/new'], {
            queryParams: { code }
          });
        } else {
          const message = this.translate.instant('passwordReset.verify.invalid');
          this.notification.error(message, 4000);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Verify code error:', error);

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
          errorMsg = this.translate.instant('passwordReset.verify.error');
        }

        this.notification.error(errorMsg, 4000);
      }
    });
  }
}
