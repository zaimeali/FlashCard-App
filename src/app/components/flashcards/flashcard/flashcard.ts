import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Helper type for touch events
type TouchPoint = { x: number; y: number };

@Component({
  selector: 'app-flashcard',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './flashcard.html',
  styleUrl: './flashcard.scss',
})
export class Flashcard {
  @Input() cardData: any;
  @Input() status: 'correct' | 'incorrect' | 'skipped' | 'none' = 'none';
  @Input() isCurrentSkipped = false;

  @Output() correct = new EventEmitter<void>();
  @Output() incorrect = new EventEmitter<void>();
  @Output() skip = new EventEmitter<void>();

  // Swipe events
  @Output() swipeLeft = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();

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

  // Live drag state
  dragOffset = signal(0);
  isDragging = signal(false);

  private touchStartPoint: TouchPoint | null = null;
  private touchMoved = false;

  getTransform() {
    const offset = this.dragOffset();
    const rotation = this.isFlipped ? 180 : 0;
    const tilt = offset * 0.05; // Slightly more tilt
    return `translateX(${offset}px) rotate(${tilt}deg) rotateY(${rotation}deg)`;
  }

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

  // Touch event handlers for swipe
  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.touchStartPoint = { x: touch.clientX, y: touch.clientY };
      this.touchMoved = false;
      this.dragOffset.set(0);
      this.isDragging.set(true);
    }
  }

  onTouchMove(event: TouchEvent) {
    if (!this.touchStartPoint) return;
    
    const touch = event.touches[0];
    const dx = touch.clientX - this.touchStartPoint.x;
    const dy = touch.clientY - this.touchStartPoint.y;

    // Only drag horizontally if dx > dy
    if (Math.abs(dx) > Math.abs(dy)) {
      this.touchMoved = true;
      this.dragOffset.set(dx);
      // Prevent scrolling while dragging horizontally
      if (Math.abs(dx) > 10) {
        // Many browsers require { passive: false } for preventDefault to work
        // but Angular 16+ template bindings are often passive by default on some platforms
        // If this doesn't work, we'll move to Renderer2 or HostListener
        try {
          if (event.cancelable) {
            event.preventDefault();
          }
        } catch (e) {}
      }
    }
  }

  onTouchEnd(event: TouchEvent) {
    this.isDragging.set(false);

    if (!this.touchStartPoint || !this.touchMoved) {
      this.touchStartPoint = null;
      this.dragOffset.set(0);
      return;
    }

    const touch = event.changedTouches[0];
    const dx = touch.clientX - this.touchStartPoint.x;
    const dy = touch.clientY - this.touchStartPoint.y;

    // Reset drag offset visually (transition will handle smooth snap)
    this.dragOffset.set(0);

    // Only consider horizontal swipes
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        this.swipeLeft.emit();
      } else {
        this.swipeRight.emit();
      }
    }
    
    this.touchStartPoint = null;
    this.touchMoved = false;
  }
}
