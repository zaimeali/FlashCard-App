import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-home',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  groups = [
    { name: 'Biology', description: 'Cell structure, genetics, and more.', cardCount: 24 },
    { name: 'History', description: 'World history flashcards.', cardCount: 15 },
    { name: 'Math', description: 'Algebra, geometry, calculus.', cardCount: 42 },
    { name: 'Biology2', description: 'Cell structure, genetics, and more.', cardCount: 24 },
    { name: 'History2', description: 'World history flashcards.', cardCount: 15 },
    { name: 'Math2', description: 'Algebra, geometry, calculus.', cardCount: 42 },
    { name: 'Biology3', description: 'Cell structure, genetics, and more.', cardCount: 24 },
    { name: 'History3', description: 'World history flashcards.', cardCount: 15 },
    { name: 'Math3', description: 'Algebra, geometry, calculus.', cardCount: 42 },
    { name: 'Biology4', description: 'Cell structure, genetics, and more.', cardCount: 24 },
    { name: 'History4', description: 'World history flashcards.', cardCount: 15 },
    { name: 'Math4', description: 'Algebra, geometry, calculus.', cardCount: 42 },
    { name: 'Biology5', description: 'Cell structure, genetics, and more.', cardCount: 24 },
    { name: 'History5', description: 'World history flashcards.', cardCount: 15 },
    { name: 'Math5', description: 'Algebra, geometry, calculus.', cardCount: 42 },
    { name: 'Math6', description: 'Algebra, geometry, calculus.', cardCount: 42 },
    { name: 'Biology6', description: 'Cell structure, genetics, and more.', cardCount: 24 },
    { name: 'History6', description: 'World history flashcards.', cardCount: 15 },
    { name: 'Math7', description: 'Algebra, geometry, calculus.', cardCount: 42 }
  ];

  readonly INITIAL_GROUPS = 12;
  readonly LOAD_MORE_GROUPS = 6;
  visibleGroupsCount = this.INITIAL_GROUPS;

  get totalCards() {
    return this.groups.reduce((acc, currentGroup) => acc + currentGroup.cardCount, 0);
  }

  get visibleGroups() {
    return this.groups.slice(0, this.visibleGroupsCount);
  }

  get canLoadMore() {
    // Show Load More only if there are more groups to show
    return this.groups.length > this.visibleGroupsCount;
  }

  loadMore() {
    this.visibleGroupsCount += this.LOAD_MORE_GROUPS;
  }

  openGroup(group: any) {
    // Navigate to flashcard page, e.g. using Angular Router
    // this.router.navigate(['/flashcards', group.name]);
  }
}
