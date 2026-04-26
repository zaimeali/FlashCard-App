import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { FlashcardService } from '../../services/flashcards/flashcard-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../services/alert/alert.service';
import { SecurityValidators, sanitizeInput } from '../../utils/security/security-validators';
import { FormControl } from '@angular/forms';

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
    MatMenuModule,
    NgxSpinnerModule
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
export class Home implements OnInit {
  private router = inject(Router);
  private alertService = inject(AlertService);

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
  visibleGroupsCount = signal<number>(this.INITIAL_GROUPS);

  flashCardsGroup = signal<Array<FlashCardGroup>>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Inline Editing
  editingGroupId = signal<string | null>(null);
  editName = signal<string>('');
  editDescription = signal<string>('');

  isEditSafe = computed(() => {
    const name = this.editName();
    const desc = this.editDescription();
    
    const nameSafe = !SecurityValidators.noMaliciousContent()(new FormControl(name));
    const descSafe = !SecurityValidators.noMaliciousContent()(new FormControl(desc));
    
    return nameSafe && descSafe;
  });

  // Search and Filtering
  searchTerm = signal<string>('');

  totalCards = computed(() => {
    if (this.isLoading()) return 0;
    return this.flashCardsGroup().length;
  });

  filteredGroups = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.flashCardsGroup();

    return this.flashCardsGroup().filter(group =>
      group.name.toLowerCase().includes(term)
    );
  });

  visibleGroups = computed(() => {
    if (this.isLoading()) return [];
    return this.filteredGroups().slice(0, this.visibleGroupsCount());
  });

  canLoadMore = computed(() => {
    return this.filteredGroups().length > this.visibleGroupsCount();
  });


  constructor(private flashcardService: FlashcardService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loadFlashCardGroups();
  }

  loadMore() {
    this.visibleGroupsCount.update(count => count + this.LOAD_MORE_GROUPS);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    // Reset pagination when searching
    this.visibleGroupsCount.set(this.INITIAL_GROUPS);
  }


  private async loadFlashCardGroups(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.spinner.show();

      const flashCardGroups = await this.flashcardService.getFlashCardGroups();
      this.flashCardsGroup.set(flashCardGroups);
    } catch (error) {
      this.errorMessage.set(error as string)
    } finally {
      this.isLoading.set(false);
      this.spinner.hide();
    }
  }

  async deleteGroup(id: string) {
    if (!id || id.trim() === '') {
      this.alertService.error('Error', 'Invalid Group ID provided for deletion.');
      return;
    }

    const dialogRef = this.alertService.confirm(
      'Delete Group?',
      'Are you sure you want to delete this flashcard group? This action cannot be undone.',
      'Delete',
      'Cancel'
    );

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.flashcardService.deleteFlashCardGroup(id);
          this.flashCardsGroup.update(groups => groups.filter(group => group.flashCardGroupId !== id));
        } catch (error) {
          console.error('Error deleting flashcard group: ', error);
        }
      }
    });
  }

  startEdit(group: FlashCardGroup) {
    this.editingGroupId.set(group.flashCardGroupId);
    this.editName.set(group.name);
    this.editDescription.set(group.description);
  }

  cancelEdit() {
    this.editingGroupId.set(null);
  }

  async saveEdit() {
    const id = this.editingGroupId();
    if (!id) return;

    const currentGroups = this.flashCardsGroup();
    const groupToUpdate = currentGroups.find(g => g.flashCardGroupId === id);

    if (!groupToUpdate) {
      this.editingGroupId.set(null);
      return;
    }

    const updatedGroup = {
      ...groupToUpdate,
      name: sanitizeInput(this.editName()),
      description: sanitizeInput(this.editDescription())
    };

    try {
      this.flashCardsGroup.update(groups =>
        groups.map(g => g.flashCardGroupId === id ? updatedGroup : g)
      );
      this.editingGroupId.set(null);

      await this.flashcardService.updateFlashCardGroup(updatedGroup);
    } catch (error) {
      this.flashCardsGroup.set(currentGroups);
      console.error('Failed to update group:', error);
      this.alertService.error('Error', 'Failed to update group');
    }
  }

  openGroup(group: FlashCardGroup) {
    if (this.editingGroupId() === group.flashCardGroupId) return; // Don't navigate while editing
    this.router.navigate(['/flashcards', group.flashCardGroupId]);
  }

  createGroup() {
    this.router.navigate(['/flashcards/create/group']);
  }
}
