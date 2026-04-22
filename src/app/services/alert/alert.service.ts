import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionAlertComponent, AlertData } from '../../utils/alert/action-alert/action-alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private dialog = inject(MatDialog);

  show(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', confirmText?: string) {
    const dialogData: AlertData = {
      title,
      message,
      type,
      confirmText
    };
    
    return this.dialog.open(ActionAlertComponent, {
      data: dialogData,
      maxWidth: '400px',
      panelClass: 'fc-alert-dialog'
    });
  }

  success(title: string, message: string, confirmText?: string) {
    return this.show(title, message, 'success', confirmText);
  }

  error(title: string, message: string, confirmText?: string) {
    return this.show(title, message, 'error', confirmText);
  }

  warning(title: string, message: string, confirmText?: string) {
    return this.show(title, message, 'warning', confirmText);
  }

  confirm(title: string, message: string, confirmText: string = 'Confirm', cancelText: string = 'Cancel') {
    return this.dialog.open(ActionAlertComponent, {
      data: {
        title,
        message,
        type: 'warning',
        confirmText,
        cancelText,
        isConfirmation: true
      },
      maxWidth: '400px',
      panelClass: 'fc-alert-dialog'
    });
  }
}
