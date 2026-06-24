import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucidePencil, lucideTrash2 } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import type { Convocatoria } from '../../../models/convocatorias.models';
import {
  HlmDropdownMenuTrigger,
  HlmDropdownMenu,
  HlmDropdownMenuLabel,
  HlmDropdownMenuSeparator,
  HlmDropdownMenuGroup,
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
    HlmDropdownMenuGroup,
    HlmDropdownMenuTrigger,
  ],
  providers: [provideIcons({ lucideEllipsis, lucidePencil, lucideTrash2 })],
  template: `
    <button
      hlmBtn
      variant="ghost"
      class="h-6 w-6 p-0.5"
      [hlmDropdownMenuTrigger]="menu"
      align="start"
    >
      <ng-icon hlm size="sm" name="lucideEllipsis" />
    </button>

    <ng-template #menu>
      <hlm-dropdown-menu>
        <hlm-dropdown-menu-label>Acciones</hlm-dropdown-menu-label>
        <hlm-dropdown-menu-separator />
        <hlm-dropdown-menu-group class="flex flex-col gap-2 ">
          <button hlmDropdownMenuItem>
            <ng-icon name="lucidePencil" class="mr-2" />
            Editar
          </button>
          <button hlmDropdownMenuItem>
            <ng-icon name="lucideTrash2" class="mr-2" />
            Eliminar
          </button>
        </hlm-dropdown-menu-group>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class BotonAccionesColumna {
  private readonly _context = injectFlexRenderContext<CellContext<Convocatoria, unknown>>();
  protected readonly _element = this._context.row.original;
}
