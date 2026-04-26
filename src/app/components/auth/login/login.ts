import { Component, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Routes } from '../../../utils/auth-guard/constants/routes';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    effect(() => {
      const user = this.authService.user();
      console.log('[Login] User signal changed:', user);
      if (user) {
        console.log('[Login] User authenticated, redirecting to HOME');
        this.router.navigate([`/${Routes.HOME}`]);
      } else {
        console.log('[Login] User is null, staying on login page');
      }
    });
  }

  public async loginWithGithub() {
    const response = await this.authService.loginWithGithub();

    console.log("Github Login Response: ", response);
  }

  public async loginWithGoogle() {
    const response = await this.authService.loginWithGoogle();

    console.log("Google Login Response: ", response);
  }
}
