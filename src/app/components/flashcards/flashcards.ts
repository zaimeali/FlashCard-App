import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Flashcard } from './flashcard/flashcard';

@Component({
  selector: 'app-flashcards',
  imports: [CommonModule, MatIconModule, MatButtonModule, Flashcard],
  templateUrl: './flashcards.html',
  styleUrl: './flashcards.scss',
})
export class Flashcards {
  flashcardsMockData = [
    { id: '1', question: 'Mitochondria', answer: 'The powerhouse of the cell.', hints: ['Organelle responsible for energy production', 'Found in most eukaryotic cells'] },
    { id: '2', question: 'Photosynthesis', answer: 'Process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.', hints: ['How plants make food', 'Occurs in the chloroplasts'] },
    { id: '3', question: 'Gravity', answer: 'The universal force of attraction acting between all matter.', hints: ['What keeps us on the ground', 'Discovered by Isaac Newton'] },
    { id: '4', question: 'Ribosome', answer: 'A complex molecule made of ribosomal RNA molecules and proteins that form a factory for protein synthesis in cells.', hints: ['Protein factory', 'Can be free-floating or attached to the ER'] },
    { id: '5', question: 'Mitosis', answer: 'A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus.', hints: ['Cell division for growth and repair', 'Consists of prophase, metaphase, anaphase, and telophase'] },
    { id: '6', question: 'Osmosis', answer: 'The spontaneous net movement or diffusion of solvent molecules through a selectively permeable membrane from a region of high water potential to a region of low water potential.', hints: ['Water movement across a membrane', 'Plays a crucial role in plant cell turgor pressure'] }
  ];

  currentIndex = signal(0);
  
  correctCount = signal(0);
  incorrectCount = signal(0);
  skippedCount = signal(0);
  
  totalCards = this.flashcardsMockData.length;
  visibleHintIndices = signal<Set<number>>(new Set());

  // Computed percentages
  totalAnswered = computed(() => this.correctCount() + this.incorrectCount() + this.skippedCount());
  
  correctPercentage = computed(() => this.totalAnswered() ? (this.correctCount() / this.totalAnswered()) * 100 : 0);
  incorrectPercentage = computed(() => this.totalAnswered() ? (this.incorrectCount() / this.totalAnswered()) * 100 : 0);
  skippedPercentage = computed(() => this.totalAnswered() ? (this.skippedCount() / this.totalAnswered()) * 100 : 0);

  get activeCard() {
    return this.flashcardsMockData[this.currentIndex()];
  }

  allHintsVisible = computed(() => {
    return this.visibleHintIndices().size === this.activeCard.hints.length && this.activeCard.hints.length > 0;
  });

  toggleHints() {
    if (this.allHintsVisible()) {
      // All visible — hide all on click
      this.visibleHintIndices.set(new Set());
    } else {
      // Show the next hidden hint one at a time
      const current = this.visibleHintIndices();
      const nextIndex = this.activeCard.hints.findIndex((_, i) => !current.has(i));
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
    this.correctCount.update(c => c + 1);
    this.nextCard();
  }

  handleIncorrect() {
    this.incorrectCount.update(c => c + 1);
    this.nextCard();
  }

  handleSkip() {
    this.skippedCount.update(c => c + 1);
    this.nextCard();
  }

  nextCard() {
    this.visibleHintIndices.set(new Set()); // reset hints explicitly 
    if (this.currentIndex() < this.totalCards - 1) {
      this.currentIndex.update(i => i + 1);
    }
  }

  prevCard() {
    this.visibleHintIndices.set(new Set()); // reset hints explicitly 
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
    }
  }
}
