import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; display: flex; flex-direction: column; gap: 10px;">
      @for (toast of toasts; track toast.id) {
        <div class="toast-message" [ngClass]="toast.type" 
             style="min-width: 300px; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); color: white; display: flex; justify-content: space-between; align-items: center; animation: slideIn 0.3s ease-out;">
          <span>{{ toast.text }}</span>
          <button (click)="remove(toast.id!)" style="background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; margin-left: 15px;">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .success { background-color: #28a745; }
    .error { background-color: #dc3545; }
    .info { background-color: #17a2b8; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastContainer implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription!: Subscription;
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.subscription = this.toastService.toastState.subscribe((toast) => {
      this.toasts.push(toast);
      this.cdr.detectChanges();
      setTimeout(() => this.remove(toast.id!), 5000);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.cdr.detectChanges();
  }
}
