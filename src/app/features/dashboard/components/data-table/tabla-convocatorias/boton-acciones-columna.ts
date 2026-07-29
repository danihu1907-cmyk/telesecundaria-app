import { Component, ChangeDetectionStrategy, input, inject, signal, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideEye, lucidePencil, lucideCircleX } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { Convocatoria } from '../../../models/convocatorias.models';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';

import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

import { ConvocatoriasService } from '../../../services/convocatorias.service';
import { firstValueFrom } from 'rxjs';
import { toast } from '@spartan-ng/brain/sonner';

@Component({
  selector: 'boton-acciones-columna',
  imports: [
    HlmButton,
    NgIcon,
    HlmIcon,
    HlmButtonImports,
    HlmAlertDialogImports,
    HlmDropdownMenuImports,
  ],
  providers: [provideIcons({ lucideEllipsis, lucidePencil, lucideCircleX, lucideEye })],
  template: `
    <button
      hlmBtn
      (click)="$event.stopPropagation()"
      variant="ghost"
      class="h-6 w-6 p-0.5"
      [hlmDropdownMenuTrigger]="menu"
    >
      <ng-icon hlm size="sm" name="lucideEllipsis" />
    </button>

    <ng-template #menu>
      <hlm-dropdown-menu class="w-full">
        <hlm-dropdown-menu-label>Acciones</hlm-dropdown-menu-label>
        <hlm-dropdown-menu-separator />
        <!-- boton ver convocatoria -->
        <button hlmDropdownMenuItem (click)="verConvocatoria()">
          <ng-icon name="lucideEye" />
          Ver
        </button>
        <!-- boton editar -->
        <button hlmDropdownMenuItem>
          <ng-icon name="lucidePencil" />
          Editar
        </button>
        <hlm-dropdown-menu-separator />
        <!-- boton eliminar-->
        <button [hlmAlertDialogTriggerFor]="deleteDialog" hlmDropdownMenuItem variant="destructive">
          <ng-icon name="lucideCircleX" />
          Cancelar
        </button>
      </hlm-dropdown-menu>
    </ng-template>

    <!-- alert dialog para confirmar la eliminacion -->
    <hlm-alert-dialog #deleteDialog="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx">
        <hlm-alert-dialog-header>
          <hlm-alert-dialog-media>
            <ng-icon name="lucideCircleX" />
          </hlm-alert-dialog-media>
          <h2 hlmAlertDialogTitle class="font-semibold">¿Cancelar Convocatoria?</h2>
          <p hlmAlertDialogDescription>
            Al cancelar la convocatoria, no estará disponible para los usuarios. Esta acción no se
            puede deshacer. ¿Deseas continuar?
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Salir</button>
          <button
            hlmAlertDialogAction
            variant="destructive"
            [disabled]="eliminando()"
            (click)="eliminarConvocatoria(ctx)"
          >
            @if (eliminando()) {
              <ng-icon name="lucideLoader" class="h-4 w-4 animate-spin mr-2" />
              Cancelando...
            } @else {
              Cancelar convocatoria
            }
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class BotonAccionesColumna {
  private readonly _context = injectFlexRenderContext<CellContext<Convocatoria, unknown>>();
  private readonly _convocatoriasService = inject(ConvocatoriasService);
  protected readonly _element = this._context.row.original;
  readonly ver = input<(convocatoria: Convocatoria) => void>();

  readonly convocatoriaEliminada = output<string>();

  protected readonly eliminando = signal(false);

  protected readonly verConvocatoria = () => {
    this.ver()?.(this._element);
  };

  protected readonly eliminarConvocatoria = async (ctx: { close?: () => void }) => {
    if (!this._element?.claveConvocatoria) {
      toast.error('Error', {
        description: 'No se pudo obtener la clave de la convocatoria.',
      });
      return;
    }

    this.eliminando.set(true);

    try {
      //Construir el request con path + query
      const request = {
        claveConvocatoria: this._element.claveConvocatoria,
        nombreUsuario: 'admin', //Cambiar por el usuario real de la sesión
      };

      console.log(
        `Eliminando: /Convocatorias/${request.claveConvocatoria}?nombreUsuario=${request.nombreUsuario}`,
      );

      const exito = await firstValueFrom(this._convocatoriasService.eliminarConvocatoria(request));

      this.eliminando.set(false);

      if (exito) {
        toast.success('Convocatoria cancelada', {
          description: `La convocatoria "${this._element.titulo}" se canceló correctamente.`,
          duration: 5000,
        });

        ctx.close?.(); // Cerrar el modal si se proporciona la función close

        //Emitir evento para actualizar la tabla
        this.convocatoriaEliminada.emit(this._element.claveConvocatoria);
        //
      } else {
        toast.error('Error al cancelar convocatoria', {
          description: 'Ocurrió un error al intentar cancelar la convocatoria.',
          duration: 6000,
        });
      }
    } catch (error: any) {
      this.eliminando.set(false);
      console.error('Error:', error);
      toast.error('Error al cancelar convocatoria', {
        description: error?.message || 'Ocurrió un error inesperado.',
        duration: 6000,
      });
    }
  };
}
