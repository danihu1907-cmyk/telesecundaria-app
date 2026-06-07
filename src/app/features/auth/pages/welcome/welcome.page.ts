import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.css'],
})
export class WelcomePage {
  constructor(private router: Router) {}

  irARegistro(): void {
    this.router.navigate(['/register']);
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }
}
