import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // <-- AGREGADO: Necesario para la navegación del nuevo botón
import { BannerHeroService } from '../../services/banner-hero.service';
import { Publicacion } from '../../models/publicacion.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink], // <-- AGREGADO: Sumamos RouterLink a los imports
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit {
  banners: WritableSignal<Publicacion[]> = signal([]);
  indiceActual = signal<number>(0);

  constructor(private bannerService: BannerHeroService) {}

  ngOnInit(): void {
    this.bannerService.obtenerBanners().subscribe({
      next: (datos: Publicacion[]) => {
        const filtrados = datos.filter((p: Publicacion) => p.destacado && p.estatusVisible);
        this.banners.set(filtrados);
        this.indiceActual.set(0);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  // --- ASEGÚRATE DE QUE ESTAS DOS FUNCIONES ESTÉN EXACTAMENTE ASÍ ---

  siguiente(): void {
    this.indiceActual.update((actual) => {
      if (actual < this.banners().length - 1) {
        return actual + 1;
      } else {
        return 0; // Regresa al inicio
      }
    });
  }

  anterior(): void {
    this.indiceActual.update((actual) => {
      if (actual > 0) {
        return actual - 1;
      } else {
        return this.banners().length - 1; // Va al final
      }
    });
  }
} // <-- Esta llave final SIEMPRE debe ir al último de todo tu código
