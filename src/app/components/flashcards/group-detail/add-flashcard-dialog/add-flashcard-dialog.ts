import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SecurityValidators, sanitizeInput } from '../../../../utils/security/security-validators';

export interface HintItem {
  hintId?: string;
  hint: string;
}

export interface AddFlashcardData {
  flashCardId?: string;
  question: string;
  answer: string;
  hints: HintItem[];
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
  hints = signal<HintItem[]>([]);
  maxHints = 3;

  constructor(
    public dialogRef: MatDialogRef<AddFlashcardDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddFlashcardData
  ) {
    this.flashcardForm = new FormGroup({
      question: new FormControl(data?.question || '', [
        Validators.required, 
        Validators.maxLength(100),
        SecurityValidators.noMaliciousContent()
      ]),
      answer: new FormControl(data?.answer || '', [
        Validators.required, 
        Validators.maxLength(300),
        SecurityValidators.noMaliciousContent()
      ]),
    });

    if (data?.hints) {
      this.hints.set([...data.hints]);
    }
  }

  isFormValid(): boolean {
    const q = this.flashcardForm.get('question')?.value;
    const a = this.flashcardForm.get('answer')?.value;
    const allHintsSafeAndFilled = this.hints().every(h => {
      const val = h.hint?.trim();
      return !!val && !SecurityValidators.noMaliciousContent()(new FormControl(val));
    });
    return this.flashcardForm.valid && allHintsSafeAndFilled;
  }

  trackByFn(index: number): number {
    return index;
  }

  addHint() {
    const currentHints = this.hints();
    if (currentHints.length < this.maxHints) {
      this.hints.set([...currentHints, { hint: '' }]);
    }
  }

  removeHint(index: number) {
    const currentHints = this.hints();
    currentHints.splice(index, 1);
    this.hints.set([...currentHints]);
  }

  updateHint(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const currentHints = [...this.hints()];
    currentHints[index] = { ...currentHints[index], hint: input.value };
    this.hints.set(currentHints);
  }

  onSave() {
    if (this.flashcardForm.valid) {
      // Filter out empty hints and sanitize
      const filteredHints = this.hints()
        .filter(h => h.hint.trim() !== '')
        .map(h => ({ ...h, hint: sanitizeInput(h.hint) }));

      this.dialogRef.close({
        flashCardId: this.data.flashCardId,
        question: sanitizeInput(this.flashcardForm.value.question),
        answer: sanitizeInput(this.flashcardForm.value.answer),
        hints: filteredHints,
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
