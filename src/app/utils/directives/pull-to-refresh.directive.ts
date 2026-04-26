import { Directive, ElementRef, EventEmitter, HostListener, Output, Input } from '@angular/core';

@Directive({
  selector: '[appPullToRefresh]',
  standalone: true
})
export class PullToRefreshDirective {
  @Input() pullThreshold = 80;
  @Output() pullProgress = new EventEmitter<number>();
  @Output() refresh = new EventEmitter<void>();

  private startY = 0;
  private currentY = 0;
  private isPulling = false;

  constructor(private el: ElementRef) {}

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const scrollTop = this.el.nativeElement.scrollTop;
    if (scrollTop === 0) {
      this.startY = event.touches[0].pageY;
      this.isPulling = true;
    } else {
      this.isPulling = false;
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.isPulling) return;

    this.currentY = event.touches[0].pageY;
    const diff = this.currentY - this.startY;

    if (diff > 0) {
      // Prevent browser default pull-to-refresh only if we are at the top and pulling down
      if (this.el.nativeElement.scrollTop === 0) {
        // Apply some resistance
        const progress = Math.min(diff / this.pullThreshold, 1.5);
        this.pullProgress.emit(progress);
        
        // If we've pulled enough, we might want to preventDefault to stop browser behavior
        if (diff > 10) {
          if (event.cancelable) {
            // event.preventDefault(); // This can sometimes interfere with scrolling up, use with care
          }
        }
      } else {
        this.isPulling = false;
        this.pullProgress.emit(0);
      }
    } else {
      this.pullProgress.emit(0);
    }
  }

  @HostListener('touchend')
  onTouchEnd() {
    if (!this.isPulling) return;

    const diff = this.currentY - this.startY;
    if (diff >= this.pullThreshold) {
      this.refresh.emit();
    }
    
    this.isPulling = false;
    this.startY = 0;
    this.currentY = 0;
    this.pullProgress.emit(0);
  }
}
