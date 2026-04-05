import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface AddFlashcardData {
  question: string;
  answer: string;
  hints: string[];
  isEdit?: boolean;
}

@Component({
  selector: 'app-add-flashcard-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-flashcard-dialog.html',
  styleUrls: ['./add-flashcard-dialog.scss'],
})
export class AddFlashcardDialog {
  flashcardForm: FormGroup;
  hints = signal<string[]>([]);
  maxHints = 3;

  constructor(
    public dialogRef: MatDialogRef<AddFlashcardDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddFlashcardData
  ) {
    this.flashcardForm = new FormGroup({
      question: new FormControl(data?.question || '', [Validators.required, Validators.maxLength(100)]),
      answer: new FormControl(data?.answer || '', [Validators.required, Validators.maxLength(300)]),
    });

    if (data?.hints) {
      this.hints.set([...data.hints]);
    }
  }

  isFormValid(): boolean {
    const q = this.flashcardForm.get('question')?.value;
    const a = this.flashcardForm.get('answer')?.value;
    const allHintsFilled = this.hints().every(h => !!h.trim());
    return !!(q?.trim() && a?.trim()) && allHintsFilled;
  }

  trackByFn(index: number): number {
    return index;
  }

  addHint() {
    const currentHints = this.hints();
    if (currentHints.length < this.maxHints) {
      this.hints.set([...currentHints, '']);
    }
  }

  removeHint(index: number) {
    const currentHints = this.hints();
    currentHints.splice(index, 1);
    this.hints.set([...currentHints]);
  }

  updateHint(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const currentHints = this.hints();
    currentHints[index] = input.value;
    this.hints.set([...currentHints]);
  }

  onSave() {
    if (this.flashcardForm.valid) {
      // Filter out empty hints
      const filteredHints = this.hints().filter(h => h.trim() !== '');
      this.dialogRef.close({
        ...this.flashcardForm.value,
        hints: filteredHints,
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
