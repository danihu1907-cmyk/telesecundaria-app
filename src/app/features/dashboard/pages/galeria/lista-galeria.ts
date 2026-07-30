import { Component, inject, OnInit } from '@angular/core';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { lucideEdit, lucideTrash } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { GaleriaService } from '../../services/galeria.service';
import { CommonModule } from '@angular/common';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
  selector: 'lista-galeria',
  imports: [
    HlmItemImports,
    NgIcon,
    CommonModule,
    HlmBadgeImports,
    HlmButtonImports,
    HlmRadioGroupImports,
    HlmFieldImports,
  ],

  template: `
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
        <div class="max-h-[350px] overflow-y-auto pr-2">
          <fieldset hlmFieldSet class="w-full">
            <hlm-radio-group class="flex flex-col gap-2">
              @for (imagen of imagenes(); track imagen.claveImagen) {
                <label hlmFieldLabel [for]="'radio-' + imagen.claveImagen" class="w-full">
                  <div hlmField orientation="horizontal" class="w-full">
                    <!-- Imagen -->
                    <hlm-item-media variant="image" class="shrink-0">
                      <img
                        [src]="imagen.rutaUrl"
                        [alt]="imagen.nombreArchivo"
                        class="size-10 rounded-md object-cover"
                      />
                    </hlm-item-media>

                    <!-- Contenido -->
                    <div hlmFieldContent class="flex-1">
                      <div hlmFieldTitle>
                        {{ imagen.nombreArchivo }}
                      </div>

                      <div hlmFieldDescription>
                        Tipo de recurso

                        <span hlmBadge variant="secondary" class="ml-2">
                          {{ imagen.tipoRecurso }}
                        </span>
                      </div>
                    </div>

                    <!-- Radio -->

                    <hlm-radio
                      class="ml-auto"
                      [value]="imagen.claveImagen"
                      [inputId]="'radio-' + imagen.claveImagen"
                    >
                      <hlm-radio-indicator indicator />
                    </hlm-radio>
                  </div>
                </label>
              }
            </hlm-radio-group>
          </fieldset>
        </div>
      }
    }
  `,
  providers: [provideIcons({ lucideEdit, lucideTrash })],
})
export class ListaGaleria implements OnInit {
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
