import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-abandon-confirmation-modal',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2>{{ 'game.abandon.title' | translate }}</h2>
        <p>{{ 'game.abandon.message' | translate }}</p>
        <p class="warning">{{ 'game.abandon.warning' | translate }}</p>

        <div class="modal-actions">
          <button class="btn-secondary" (click)="onCancel()">
            {{ 'game.abandon.cancel' | translate }}
          </button>
          <button class="btn-danger" (click)="onConfirm()">
            {{ 'game.abandon.confirm' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 400px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }

    .modal-content h2 {
      margin-top: 0;
      color: #333;
    }

    .warning {
      color: #e74c3c;
      font-weight: 600;
      margin: 1rem 0;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }

    .btn-secondary, .btn-danger {
      padding: 0.6rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-danger:hover {
      background: #c0392b;
    }
  `]
})
export class AbandonConfirmationModalComponent {
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm(): void {
        this.confirm.emit();
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
