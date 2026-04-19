import { Component, Signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '@supabase/supabase-js';
import { ConfirmDialogComponent } from './delete-mat-dialog/delete-mat-dialog';

@Component({
  selector: 'app-profile',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ConfirmDialogComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  userSignal: Signal<User | null>;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.userSignal = this.authService.user;
  }

  get name(): string {
    return this.userSignal()?.user_metadata['full_name'] || '';
  }

  get email(): string {
    return this.userSignal()?.email || '';
  }

  deleteAccount() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Account',
        message: 'Are you sure you want to delete your account? This action cannot be undone.',
        confirmText: 'Delete Forever',
        cancelText: 'Keep Account'
      },
      maxWidth: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.deleteAccount();
      }
    });
  }
}
