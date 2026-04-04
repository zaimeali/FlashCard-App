import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  public login(): void {
    // todo
  }
}
