import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoading = this.authService.isLoading;
  isAuthenticated = this.authService.isAuthenticated;

  get isPublicPage(): boolean {
    const url = this.router.url.split('?')[0];
    return url === '/terms' || url === '/privacy-policy';
  }

  constructor() {}
}
