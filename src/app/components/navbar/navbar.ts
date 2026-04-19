import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private router = inject(Router);

  constructor(private authService: AuthService) { }

  get isPublicPage(): boolean {
    const url = this.router.url.split('?')[0];
    return url === '/terms' || url === '/privacy-policy';
  }

  public async logout() {
    await this.authService.logout();
  }
}
