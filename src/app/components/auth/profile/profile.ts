import { Component, Signal } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-profile',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  userSignal: Signal<User | null>;

  constructor(private authService: AuthService) {
    this.userSignal = this.authService.user;

    console.log('[Profile] User signal initialized:', this.userSignal());
  }
}
