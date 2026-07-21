import { Component, inject, OnInit } from '@angular/core';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { lucideEdit, lucideTrash } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ImagenGaleria } from '../../models/galeria.models';
import { GaleriaService } from '../../services/galeria.service';
import { CommonModule } from '@angular/common';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'galeria-imagenes',
  imports: [HlmItemImports, NgIcon, CommonModule, HlmBadgeImports, HlmButtonImports],
  host: {
    class: 'flex min-h-0 min-w-0 h-full w-full flex-1 overflow-hidden',
  },
  template: `
    <div
      class="flex h-full min-h-0 min-w-0 max-w-full flex-1 flex-col gap-4 overflow-hidden p-3 sm:p-4 md:p-6"
    >
      <div class="min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg ">
        @if (cargando()) {
          <div class="flex items-center justify-center py-8">
            <span class="animate-spin"></span>
            <span class="ml-2 text-muted-foreground">Cargando imágenes...</span>
          </div>
        }

        @if (error()) {
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-600">{{ error() }}</p>
            <button
              (click)="recargar()"
              class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        }

        @if (!cargando() && !error()) {
          @if (imagenes().length === 0) {
            <div class="text-center py-2 text-muted-foreground">No hay imágenes en la galería</div>
          } @else {
            <hlm-item-group class="grid grid-cols-3 ">
              @for (imagen of imagenes(); track imagen.claveImagen; let last = $last) {
                <hlm-item variant="outline">
                  <hlm-item-media variant="image">
                    <img
                      [src]="imagen.rutaUrl"
                      [alt]="imagen.nombreArchivo"
                      width="32"
                      height="32"
                      class="object-cover"
                    />
                  </hlm-item-media>

                  <hlm-item-content class="gap-3">
                    <hlm-item-title class="line-clamp-1 font-semibold">{{
                      imagen.nombreArchivo
                    }}</hlm-item-title>
                    <p hlmItemDescription>
                      Tipo de recurso:
                      <span hlmBadge class="ml-3" variant="secondary">{{
                        imagen.tipoRecurso
                      }}</span>
                    </p>
                  </hlm-item-content>

                  <hlm-item-actions class="flex gap-0">
                    <button hlmBtn variant="ghost" size="icon" class="rounded-full">
                      <ng-icon name="lucideEdit" />
                    </button>
                    <button hlmBtn variant="ghost" size="icon" class="rounded-full">
                      <ng-icon name="lucideTrash" />
                    </button>
                  </hlm-item-actions>
                </hlm-item>
              }
            </hlm-item-group>
          }
        }
      </div>
    </div>
  `,
  providers: [provideIcons({ lucideEdit, lucideTrash })],
})
export class Galeria implements OnInit {
  private GaleriaService = inject(GaleriaService);

  //Señales del servicio
  imagenes = this.GaleriaService.imagenes;
  cargando = this.GaleriaService.cargando;
  error = this.GaleriaService.error;

  ngOnInit(): void {
    this.cargarImagenes();
  }

  cargarImagenes(): void {
    // El servicio ya actualiza las signals en el pipeline; solo disparamos la petición.
    this.GaleriaService.obtenerImagenes().subscribe();
  }

  recargar(): void {
    this.GaleriaService.limpiarError();
    this.cargarImagenes();
  }
}
