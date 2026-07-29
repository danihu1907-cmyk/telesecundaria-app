import { Component, input, inject, signal, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideEye, lucidePencil, lucideCircleX } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { Aspirantes } from '../../../models/aspirantes.models';

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
        <button hlmDropdownMenuItem (click)="verAspirante()">
          <ng-icon name="lucideEye" />
          Ver
        </button>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class BotonAccionesColumna {
  private readonly _context = injectFlexRenderContext<CellContext<Aspirantes, unknown>>();

  protected readonly _element = this._context.row.original;
  readonly ver = input<(aspirante: Aspirantes) => void>();

  protected readonly verAspirante = () => {
    this.ver()?.(this._element);
  };
}
