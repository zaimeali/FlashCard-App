import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-hints-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  template: `
    <h2 mat-dialog-title>Hints</h2>
    <mat-dialog-content>
      <mat-list>
        @for (hint of hints; track i; let i = $index) {
          <mat-list-item>
            <mat-icon matListItemIcon>info_outline</mat-icon>
            <div matListItemTitle>Hint {{ i + 1 }}</div>
            <div matListItemLine>{{ hint }}</div>
          </mat-list-item>
        }
        @if (hints.length === 0) {
          <div class="no-hints-msg">
            No hints available for this flashcard.
          </div>
        }
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-raised-button color="primary" (click)="close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .no-hints-msg {
      padding: 1rem;
      text-align: center;
      color: var(--fc-muted);
      font-style: italic;
    }

    mat-list-item {
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      .no-hints-msg {
        padding: 0.75rem;
        font-size: 0.85rem;
      }
      
      mat-list-item {
        margin-bottom: 0.25rem;
        
        [matListItemTitle] {
          font-size: 0.8rem;
        }
        
        [matListItemLine] {
          font-size: 0.9rem;
        }
      }
    }
  `]
})
export class HintsDialog {
  constructor(
    public dialogRef: MatDialogRef<HintsDialog>,
    @Inject(MAT_DIALOG_DATA) public hints: string[]
  ) {}

  close() {
    this.dialogRef.close();
  }
}
