import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Flashcard } from './flashcard/flashcard';

export type CardStatus = 'correct' | 'incorrect' | 'skipped' | 'none';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { FlashcardService } from '../../services/flashcards/flashcard-service';
import { FlashCard } from '../../models/FlashCard.model';

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, Flashcard, RouterLink, NgxSpinnerModule],
  templateUrl: './flashcards.html',
  styleUrl: './flashcards.scss',
})
export class Flashcards implements OnInit {
  groupId = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private flashcardService: FlashcardService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.groupId.set(id);
      this.loadFlashcards();
    }
  }

  groupName = signal<string>('');
  flashCards = signal<FlashCard[]>([]);
  isLoading = signal(false);

  currentIndex = signal(0);

  // Statistics as signals
  correctCount = signal(0);
  incorrectCount = signal(0);
  skippedCount = signal(0);

  // Track individual card statuses
  cardStatuses = signal<Record<string, CardStatus>>({});

  totalCards = computed(() => this.flashCards().length);
  visibleHintIndices = signal<Set<number>>(new Set());

  // Computed percentages
  totalAnswered = computed(() => this.correctCount() + this.incorrectCount() + this.skippedCount());

  correctPercentage = computed(() => this.totalAnswered() ? (this.correctCount() / this.totalAnswered()) * 100 : 0);
  incorrectPercentage = computed(() => this.totalAnswered() ? (this.incorrectCount() / this.totalAnswered()) * 100 : 0);
  skippedPercentage = computed(() => this.totalAnswered() ? (this.skippedCount() / this.totalAnswered()) * 100 : 0);

  get activeCard() {
    return this.flashCards()[this.currentIndex()];
  }

  allHintsVisible = computed(() => {
    const card = this.activeCard;
    if (!card) return false;
    return this.visibleHintIndices().size === card.hints.length && card.hints.length > 0;
  });

  getCardStatus(id: string): CardStatus {
    return this.cardStatuses()[id] || 'none';
  }

  toggleHints() {
    if (this.allHintsVisible()) {
      this.visibleHintIndices.set(new Set());
    } else {
      const current = this.visibleHintIndices();
      const card = this.activeCard;
      const nextIndex = card.hints.findIndex((_, i) => !current.has(i));
      if (nextIndex !== -1) {
        const updated = new Set(current);
        updated.add(nextIndex);
        this.visibleHintIndices.set(updated);
      }
    }
  }

  hideSpecificHint(index: number) {
    const currentSet = new Set(this.visibleHintIndices());
    if (currentSet.has(index)) {
      currentSet.delete(index);
      this.visibleHintIndices.set(currentSet);
    }
  }

  isHintVisible(index: number): boolean {
    return this.visibleHintIndices().has(index);
  }

  handleCorrect() {
    this.updateCardStatus(this.activeCard.flashCardId, 'correct');
    this.nextCard(true); // pass true to indicate it was handled
  }

  handleIncorrect() {
    this.updateCardStatus(this.activeCard.flashCardId, 'incorrect');
    this.nextCard(true);
  }

  handleSkip() {
    this.updateCardStatus(this.activeCard.flashCardId, 'skipped');
    this.nextCard(true);
  }

  updateCardStatus(id: string, status: CardStatus) {
    const currentStatuses = this.cardStatuses();
    const prevStatus = currentStatuses[id] || 'none';

    // Don't update if already answered with the same status
    if (prevStatus === status) return;

    // Decrement old count if it was previously answered
    if (prevStatus === 'correct') this.correctCount.update(c => c - 1);
    if (prevStatus === 'incorrect') this.incorrectCount.update(c => c - 1);
    if (prevStatus === 'skipped') this.skippedCount.update(c => c - 1);

    // Increment new count
    if (status === 'correct') this.correctCount.update(c => c + 1);
    if (status === 'incorrect') this.incorrectCount.update(c => c + 1);
    if (status === 'skipped') this.skippedCount.update(c => c + 1);

    this.cardStatuses.update(s => ({ ...s, [id]: status }));
  }

  nextCard(isHandled: boolean = false) {
    const currentId = this.activeCard.flashCardId;
    const currentStatus = this.getCardStatus(currentId);
    const isAtEnd = this.currentIndex() >= this.totalCards() - 1;

    // Auto-skip logic: if we're moving next without an answer, mark as skipped
    // Only apply if we are NOT at the end
    if (!isHandled && currentStatus === 'none' && !isAtEnd) {
      this.updateCardStatus(currentId, 'skipped');
    }

    if (!isAtEnd) {
      this.visibleHintIndices.set(new Set());
      this.currentIndex.update(i => i + 1);
    }
  }

  prevCard() {
    const currentId = this.activeCard.flashCardId;
    const currentStatus = this.getCardStatus(currentId);
    const isAtStart = this.currentIndex() <= 0;

    // Auto-skip logic: if we're moving back without an answer, mark as skipped
    // Only apply if we are NOT at the start
    if (currentStatus === 'none' && !isAtStart) {
      this.updateCardStatus(currentId, 'skipped');
    }

    if (!isAtStart) {
      this.visibleHintIndices.set(new Set());
      this.currentIndex.update(i => i - 1);
    }
  }

  resetCardStatus() {
    this.cardStatuses.set({});
    this.correctCount.set(0);
    this.incorrectCount.set(0);
    this.skippedCount.set(0);
    this.visibleHintIndices.set(new Set());
    this.currentIndex.set(0);
    this.flashCards.set(this.flashcardService.shuffle(this.flashCards()));
  }

  private async loadFlashcards() {
    this.isLoading.set(true);
    this.spinner.show();
    try {
      const flashcardGroup = await this.flashcardService.getFlashCardGroupById(this.groupId()!);
      this.groupName.set(flashcardGroup.name);
      const shuffledCards = this.flashcardService.shuffle(flashcardGroup.flashcards);
      this.flashCards.set(shuffledCards);
    } catch (error) {
      console.error('Error loading flashcards: ', error);
    } finally {
      this.isLoading.set(false);
      this.spinner.hide();
    }
  }
}
