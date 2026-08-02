import { Component, inject, OnInit, output, signal } from '@angular/core';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { lucideCircleX, lucideEdit, lucideLoader, lucideTrash } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ImagenGaleria } from '../../models/galeria.models';
import { GaleriaService } from '../../services/galeria.service';
import { CommonModule } from '@angular/common';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { firstValueFrom } from 'rxjs';
import { toast } from '@spartan-ng/brain/sonner';

@Component({
  selector: 'galeria-imagenes',
  imports: [HlmItemImports, CommonModule, HlmBadgeImports, HlmButtonImports, HlmAlertDialogImports],
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

                  <!-- <hlm-item-actions class="flex gap-0">
                    <button hlmBtn variant="ghost" size="icon" class="rounded-full">
                      <ng-icon name="lucideEdit" />
                    </button>
                    <button
                      hlmBtn
                      [hlmAlertDialogTriggerFor]="deleteDialog"
                      variant="ghost"
                      size="icon"
                      class="rounded-full"
                      (click)="seleccionarImagen(imagen)"
                    >
                      <ng-icon name="lucideTrash" />
                    </button>
                  </hlm-item-actions> -->
                </hlm-item>
              }
            </hlm-item-group>
          }
        }
      </div>
    </div>

    <!-- <hlm-alert-dialog #deleteDialog="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx">
        <hlm-alert-dialog-header>
          <hlm-alert-dialog-media>
            <ng-icon name="lucideTrash" />
          </hlm-alert-dialog-media>
          <h2 hlmAlertDialogTitle class="font-semibold">Eliminar Imagen</h2>
          <p hlmAlertDialogDescription>
            Al eliminar la imagen, no estará disponible para los usuarios. Esta acción no se puede
            deshacer. ¿Deseas continuar?
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Salir</button>
          <button
            hlmAlertDialogAction
            variant="destructive"
            [disabled]="eliminando()"
            (click)="eliminarGaleria()"
          >
            @if (eliminando()) {
              <ng-icon name="lucideLoader" class="h-4 w-4 animate-spin mr-2" />
              Eliminando...
            } @else {
              Eliminar imagen
            }
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog> -->
  `,
  providers: [provideIcons({ lucideEdit, lucideTrash, lucideCircleX, lucideLoader })],
})
export class Galeria implements OnInit {
  private GaleriaService = inject(GaleriaService);
  private readonly _galeriaService = inject(GaleriaService);

  readonly imagenEliminada = output<string>();
  protected readonly eliminando = signal(false);
  private _element: ImagenGaleria | null = null;

  //Señales del servicio
  imagenes = this.GaleriaService.imagenes;
  cargando = this.GaleriaService.cargando;
  error = this.GaleriaService.error;

  ngOnInit(): void {
    this.cargarImagenes();
  }

  seleccionarImagen(imagen: ImagenGaleria): void {
    this._element = imagen;
  }

  protected readonly eliminarGaleria = async () => {
    const imagenSeleccionada = this._element;

    if (!imagenSeleccionada?.claveImagen) {
      toast.error('Error', {
        description: 'No se pudo obtener la clave de la imagen.',
      });
      return;
    }

    this.eliminando.set(true);

    try {
      const request = {
        claveImagen: imagenSeleccionada.claveImagen,
      };

      console.log(`Eliminando: /Galeria/${request.claveImagen}`);

      const exito = await firstValueFrom(this._galeriaService.eliminarImagen(request));

      this.eliminando.set(false);

      if (exito) {
        toast.success('Imagen eliminada', {
          description: `La imagen "${imagenSeleccionada.nombreArchivo}" se canceló correctamente.`,
          duration: 5000,
        });

        this.imagenEliminada.emit(imagenSeleccionada.claveImagen);
      } else {
        toast.error('Error al eliminar imagen', {
          description: 'Ocurrió un error al intentar eliminar la imagen.',
          duration: 6000,
        });
      }
    } catch (error: any) {
      this.eliminando.set(false);
      console.error('Error:', error);
      toast.error('Error al eliminar la imagen', {
        description: error?.message || 'Ocurrió un error inesperado.',
        duration: 6000,
      });
    }
  };

  cargarImagenes(): void {
    // El servicio ya actualiza las signals en el pipeline; solo disparamos la petición.
    this.GaleriaService.obtenerImagenes().subscribe();
  }

  recargar(): void {
    this.GaleriaService.limpiarError();
    this.cargarImagenes();
  }
}
