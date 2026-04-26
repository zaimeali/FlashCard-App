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
import { User } from '@supabase/supabase-js';
import { HintItem } from './add-flashcard-dialog/add-flashcard-dialog';
import { SecurityValidators, sanitizeInput } from '../../../utils/security/security-validators';

export interface FlashcardItem {
  flashCardId?: string;
  question: string;
  answer: string;
  hints: HintItem[];
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
  groupId = signal<string | null>(null);
  expandedIndex = signal<number | null>(null);
  currentUser!: User;

  isAddGroupDisabled = computed(() => this.flashcards().length === 0 || this.groupForm.invalid);

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private flashcardService: FlashcardService,
    private authService: AuthService
  ) {
    this.groupForm = new FormGroup({
      groupName: new FormControl('', [
        Validators.required, 
        Validators.maxLength(50),
        SecurityValidators.noMaliciousContent()
      ]),
      groupDescription: new FormControl('', [
        Validators.required, 
        Validators.maxLength(200),
        SecurityValidators.noMaliciousContent()
      ]),
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.user()!;

    if (!this.currentUser) {
      alert('You must be logged in to access this page');
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.groupId.set(id);
      this.loadGroupData(id);
    }
  }

  private async loadGroupData(id: string) {
    try {
      const group = await this.flashcardService.getFlashCardGroupById(id);

      this.groupForm.patchValue({
        groupName: group.name,
        groupDescription: group.description
      });

      const items: FlashcardItem[] = group.flashcards.map(fc => ({
        flashCardId: fc.flashCardId,
        question: fc.question,
        answer: fc.answer,
        hints: fc.hints.map(h => ({
          hintId: h.hintId,
          hint: h.hint
        }))
      }));

      this.flashcards.set(items);
    } catch (error) {
      console.error('Error loading group data:', error);
    }
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

  viewHints(hints: HintItem[]) {
    this.dialog.open(HintsDialog, {
      width: '400px',
      data: hints.map(h => h.hint) // HintsDialog likely expects string[]
    });
  }

  saveGroup() {
    if (this.groupForm.valid && this.flashcards().length > 0) {
      const payload: FlashCardGroup = {
        flashCardGroupId: this.groupId() || '',
        name: sanitizeInput(this.groupForm.value.groupName),
        description: sanitizeInput(this.groupForm.value.groupDescription),
        userId: this.currentUser.id,
        flashcards: this.flashcards().map(fc => ({
          flashCardId: fc.flashCardId || '',
          question: sanitizeInput(fc.question),
          answer: sanitizeInput(fc.answer),
          userId: this.currentUser.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          hints: fc.hints.map(h => ({
            hintId: h.hintId || '',
            hint: sanitizeInput(h.hint),
            userId: this.currentUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        })),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (this.isEditMode()) {
        this.flashcardService.editFlashCards(payload);
      } else {
        this.flashcardService.createFlashCardGroup(payload);
      }
    }
  }

  toggleExpand(index: number) {
    this.expandedIndex.set(this.expandedIndex() === index ? null : index);
  }
}
