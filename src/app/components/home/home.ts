import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlashCardGroup } from '../../models/FlashCardGroup.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  animations: [
    trigger('cardAnimation', [
      transition(':leave', [
        animate('500ms cubic-bezier(0.2, 0, 0, 1)', style({
          opacity: 0,
          transform: 'scale(0.5)',
          width: '0px',
          'min-width': '0px',
          'min-height': '0px',
          margin: '0px',
          padding: '0px',
          overflow: 'hidden'
        }))
      ])
    ])
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private router = inject(Router);

  flashCardsGroup: Array<FlashCardGroup> = [];

  groups = [
    { id: '1', name: 'Biology', description: 'Cell structure, genetics, and more.', cardCount: 24 },
    { id: '2', name: 'History', description: 'World history flashcards.', cardCount: 15 },
    { id: '3', name: 'Math', description: 'Algebra, geometry, calculus.', cardCount: 42 },
    { id: '4', name: 'Biology2', description: 'Cell structure, genetics, and more.', cardCount: 24 },
    { id: '5', name: 'History2', description: 'World history flashcards.', cardCount: 15 },
    { id: '6', name: 'Math2', description: 'Algebra, geometry, calculus.', cardCount: 42 },
    { id: '7', name: 'Biology3', description: 'Cell structure, genetics, and more.', cardCount: 24 },
    { id: '8', name: 'History3', description: 'World history flashcards.', cardCount: 15 },
    { id: '9', name: 'Math3', description: 'Algebra, geometry, calculus.', cardCount: 42 },
    { id: '10', name: 'Biology4', description: 'Cell structure, genetics, and more.', cardCount: 24 },
    { id: '11', name: 'History4', description: 'World history flashcards.', cardCount: 15 },
    { id: '12', name: 'Math4', description: 'Algebra, geometry, calculus.', cardCount: 42 },
    { id: '13', name: 'Biology5', description: 'Cell structure, genetics, and more.', cardCount: 24 },
    { id: '14', name: 'History5', description: 'World history flashcards.', cardCount: 15 },
    { id: '15', name: 'Math5', description: 'Algebra, geometry, calculus.', cardCount: 42 },
    { id: '16', name: 'Math6', description: 'Algebra, geometry, calculus.', cardCount: 42 },
    { id: '17', name: 'Biology6', description: 'Cell structure, genetics, and more.', cardCount: 24 },
    { id: '18', name: 'History6', description: 'World history flashcards.', cardCount: 15 },
    { id: '19', name: 'Math7', description: 'Algebra, geometry, calculus.', cardCount: 42 }
  ];

  // Pagination
  readonly INITIAL_GROUPS = 12;
  readonly LOAD_MORE_GROUPS = 6;
  visibleGroupsCount = this.INITIAL_GROUPS;

  // Inline Editing
  editingGroupId = signal<string | null>(null);
  editName = signal<string>('');
  editDescription = signal<string>('');

  get totalCards() {
    return this.flashCardsGroup.reduce((acc, currentGroup) => acc + currentGroup.flashcards.length, 0);
  }

  get visibleGroups() {
    return this.flashCardsGroup.slice(0, this.visibleGroupsCount);
  }

  get canLoadMore() {
    return this.flashCardsGroup.length > this.visibleGroupsCount;
  }

  loadMore() {
    this.visibleGroupsCount += this.LOAD_MORE_GROUPS;
  }

  deleteGroup(id: string) {
    this.flashCardsGroup = this.flashCardsGroup.filter(group => group.flashCardGroupId !== id);
  }

  startEdit(group: any) {
    this.editingGroupId.set(group.id);
    this.editName.set(group.name);
    this.editDescription.set(group.description);
  }

  cancelEdit() {
    this.editingGroupId.set(null);
  }

  saveEdit() {
    const id = this.editingGroupId();
    if (id) {
      this.groups = this.groups.map(g =>
        g.id === id ? { ...g, name: this.editName(), description: this.editDescription() } : g
      );
    }
    this.editingGroupId.set(null);
  }

  openGroup(group: any) {
    if (this.editingGroupId() === group.id) return; // Don't navigate while editing
    this.router.navigate(['/flashcards', group.id]);
  }

  createGroup() {
    this.router.navigate(['/flashcards/create/group']);
  }
}
