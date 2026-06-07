import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  menuAbierto = false;

  constructor(private sidebarService: SidebarService) {}

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  openSidebar() {
    this.menuAbierto = false;
    this.sidebarService.open();
  }

  navegarA(id: string) {
    this.menuAbierto = false;
    setTimeout(() => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }
}
