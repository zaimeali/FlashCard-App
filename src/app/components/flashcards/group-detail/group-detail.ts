import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddFlashcardDialog } from './add-flashcard-dialog/add-flashcard-dialog';
import { HintsDialog } from './hints-dialog/hints-dialog';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { FlashcardService } from '../../../services/flashcards/flashcard-service';
import { AuthService } from '../../../services/auth/auth.service';
import { FlashCardGroup } from '../../../models/FlashCardGroup.model';

export interface FlashcardItem {
  question: string;
  answer: string;
  hints: string[];
}

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    RouterModule,
  ],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.scss',
})
export class GroupDetail implements OnInit {
  groupForm: FormGroup;
  flashcards = signal<FlashcardItem[]>([]);
  displayedColumns: string[] = ['question', 'answer', 'hints', 'actions'];
  isEditMode = signal(false);
  expandedIndex = signal<number | null>(null);

  isAddGroupDisabled = computed(() => this.flashcards().length === 0 || this.groupForm.invalid);

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private flashcardService: FlashcardService,
    private authService: AuthService
  ) {
    this.groupForm = new FormGroup({
      groupName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      groupDescription: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.loadGroupData(id);
    }
  }

  private loadGroupData(id: string) {
    // Mocking an API response
    // In a real app, this would come from a FlashcardService
    const mockData = {
      name: 'Biology Basics',
      description: 'Foundational concepts in biology including cell structures and basic processes.',
      cards: [
        { question: 'Mitochondria', answer: 'The powerhouse of the cell.', hints: ['Energy production'] },
        { question: 'Photosynthesis', answer: 'Process by which plants use sunlight to create energy.', hints: ['Sunlight to sugar'] }
      ]
    };

    this.groupForm.patchValue({
      groupName: mockData.name,
      groupDescription: mockData.description
    });
    this.flashcards.set(mockData.cards);
  }

  openAddFlashcardDialog() {
    const dialogRef = this.dialog.open(AddFlashcardDialog, {
      width: '540px',
      autoFocus: false,
      data: { question: '', answer: '', hints: [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.flashcards.set([...this.flashcards(), result]);
      }
    });
  }

  editFlashcard(index: number) {
    const card = this.flashcards()[index];
    const dialogRef = this.dialog.open(AddFlashcardDialog, {
      width: '540px',
      autoFocus: false,
      data: { ...card, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updated = [...this.flashcards()];
        updated[index] = result;
        this.flashcards.set(updated);
      }
    });
  }

  deleteFlashcard(index: number) {
    const current = [...this.flashcards()];
    current.splice(index, 1);
    this.flashcards.set(current);
  }

  viewHints(hints: string[]) {
    this.dialog.open(HintsDialog, {
      width: '400px',
      data: hints
    });
  }

  saveGroup() {
    if (this.groupForm.valid && this.flashcards().length > 0) {
      const user = this.authService.user();
      if (!user) {
        alert('You must be logged in to create a flashcard group');
        return;
      }

      const payload: FlashCardGroup = {
        flashCardGroupId: '', // Usually handled by DB or generated if needed
        name: this.groupForm.value.groupName,
        description: this.groupForm.value.groupDescription,
        userId: user.id,
        flashcards: this.flashcards().map(fc => ({
          flashCardId: '', // Usually handled by DB
          question: fc.question,
          answer: fc.answer,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          hints: fc.hints.map(h => ({
            hintId: '', // Usually handled by DB
            hint: h,
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        })),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Saving Group:', payload);

      this.flashcardService.createFlashCardGroup(payload);
    }
  }

  toggleExpand(index: number) {
    this.expandedIndex.set(this.expandedIndex() === index ? null : index);
  }
}
