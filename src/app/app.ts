import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSidebar } from './features/dashboard/components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppSidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('telesecundaria-app');
}
