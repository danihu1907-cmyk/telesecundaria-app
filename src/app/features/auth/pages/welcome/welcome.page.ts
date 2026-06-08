import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BannerHeroService } from '../../../landing/services/banner-hero.service'; // <-- Ajusta la ruta relativa según tu árbol
import { Publicacion } from '../../../landing/models/publicacion.model';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.css'],
})
export class WelcomePage implements OnInit {
  // Signal para controlar si existe al menos una convocatoria activa
  tieneConvocatoriaActiva = signal<boolean>(false);
  cargandoValidacion = signal<boolean>(true);

  constructor(
    private bannerService: BannerHeroService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.bannerService.obtenerBanners().subscribe({
      next: (datos: Publicacion[]) => {
        // Buscamos si existe alguna publicación que sea "Convocatoria" y que sea visible
        const convocatoriaActiva = datos.some(
          (p: Publicacion) => p.categoria === 'Convocatoria' && p.estatusVisible,
        );

        this.tieneConvocatoriaActiva.set(convocatoriaActiva);
        this.cargandoValidacion.set(false);
      },
      error: (err) => {
        console.error('Error al validar estado de convocatorias:', err);
        this.tieneConvocatoriaActiva.set(false);
        this.cargandoValidacion.set(false);
      },
    });
  }
}
