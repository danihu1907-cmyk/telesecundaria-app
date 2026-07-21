import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideEye, lucidePencil, lucideCircleX } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { Convocatoria } from '../../../models/convocatorias.models';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';

import {
  HlmDropdownMenuTrigger,
  HlmDropdownMenu,
  HlmDropdownMenuLabel,
  HlmDropdownMenuSeparator,
  HlmDropdownMenuItem,
} from '../../../../../../../libs/ui/dropdown-menu/src';

@Component({
  selector: 'boton-acciones-columna',
  imports: [
    HlmButton,
    NgIcon,
    HlmIcon,
    HlmDropdownMenu,
    HlmDropdownMenuLabel,
    HlmDropdownMenuSeparator,
    HlmDropdownMenuTrigger,
    HlmButtonImports,
    HlmDropdownMenuItem,
    HlmAlertDialogImports,
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
          <button hlmAlertDialogAction variant="destructive">Cancelar convocatoria</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class BotonAccionesColumna {
  private readonly _context = injectFlexRenderContext<CellContext<Convocatoria, unknown>>();
  protected readonly _element = this._context.row.original;
  readonly ver = input<(convocatoria: Convocatoria) => void>();

  protected readonly verConvocatoria = () => {
    this.ver()?.(this._element);
  };
}
