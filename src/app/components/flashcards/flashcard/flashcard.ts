import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-flashcard',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './flashcard.html',
  styleUrl: './flashcard.scss',
})
export class Flashcard {
  @Input() cardData: any;
  
  @Output() correct = new EventEmitter<void>();
  @Output() incorrect = new EventEmitter<void>();
  @Output() skip = new EventEmitter<void>();

  private _active = false;
  @Input() set active(val: boolean) {
    this._active = val;
    if (!val) {
      this.isFlipped = false; // Reset the flip state when clicking away
    }
  }
  get active(): boolean {
    return this._active;
  }

  isFlipped = false;
  isTouchDevice = typeof window !== 'undefined' && navigator.maxTouchPoints > 0;

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  onAction(action: 'correct' | 'incorrect' | 'skip', event: MouseEvent) {
    event.stopPropagation(); // Block bubble explicitly ensuring flip does not overlap
    this.isFlipped = false; // Reset visually instantly tracking new bounds
    
    if (action === 'correct') {
      this.correct.emit();
    } else if (action === 'incorrect') {
      this.incorrect.emit();
    } else if (action === 'skip') {
      this.skip.emit();
    }
  }
}
