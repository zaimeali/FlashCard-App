import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AlertData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  isConfirmation?: boolean;
}

@Component({
  selector: 'app-action-alert',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './action-alert.html',
  styleUrl: './action-alert.scss'
})
export class ActionAlertComponent {
  constructor(
    public dialogRef: MatDialogRef<ActionAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertData
  ) {}

  get icon(): string {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'error': return 'report_problem';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'help';
    }
  }

  get iconClass(): string {
    return `alert-icon ${this.data.type}`;
  }
}
