import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BannerHeroService } from '../../services/banner-hero.service';
import { Publicacion } from '../../models/publicacion.model';
import { GaleriaImagen } from '../../models/galeria.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit {
  banners: WritableSignal<Publicacion[]> = signal([]);
  indiceActual = signal<number>(0);

  // ESTADOS DE LA PETICION
  public cargando = signal<boolean>(true);
  public hayError = signal<boolean>(false);

  // MAPA QUE RELACIONA CLAVE DE IMAGEN CON SU URL REAL
  private mapaImagenes = new Map<string, string>();

  constructor(private bannerService: BannerHeroService) {}

  ngOnInit(): void {
    this.cargando.set(true);
    this.hayError.set(false);

    // HACEMOS LAS DOS PETICIONES AL MISMO TIEMPO
    forkJoin({
      publicaciones: this.bannerService.obtenerBanners(),
      imagenes: this.bannerService.obtenerImagenes(),
    }).subscribe({
      next: ({ publicaciones, imagenes }) => {
        // CONSTRUIMOS EL MAPA DE IMAGENES
        imagenes.forEach((img: GaleriaImagen) => {
          this.mapaImagenes.set(img.claveImagen, img.rutaUrl);
        });

        const filtrados = publicaciones.filter((p: Publicacion) => p.destacado && p.estatusVisible);
        this.banners.set(filtrados);
        this.indiceActual.set(0);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.cargando.set(false);
        this.hayError.set(true);
      },
    });
  }

  // OBTIENE LA URL REAL DE LA IMAGEN A PARTIR DE SU CLAVE
  obtenerUrlImagen(clave: string | null | undefined): string {
    if (!clave) return '';
    return this.mapaImagenes.get(clave) ?? '';
  }

  siguiente(): void {
    this.indiceActual.update((actual) => {
      if (actual < this.banners().length - 1) {
        return actual + 1;
      } else {
        return 0; // REGRESA AL INICIO
      }
    });
  }

  anterior(): void {
    this.indiceActual.update((actual) => {
      if (actual > 0) {
        return actual - 1;
      } else {
        return this.banners().length - 1; // VA AL FINAL
      }
    });
  }
}
