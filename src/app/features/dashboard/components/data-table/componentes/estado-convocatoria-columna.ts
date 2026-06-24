import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideChevronLeft,
  lucideChevronsUp,
  lucideChevronUp,
  lucideCircleHelp,
} from '@ng-icons/lucide';

import { HlmIcon } from '@spartan-ng/helm/icon';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { Convocatoria } from '../../../models/convocatorias.models';

@Component({
  selector: 'estado-convocatoria-columna',

  providers: [
    provideIcons({
      lucideChevronDown,
      lucideChevronLeft,
      lucideChevronUp,
      lucideChevronsUp,
      lucideCircleHelp, // Default icon if not recognized
    }),
  ],
  template: `
    <div class="flex items-center">
      <span hlmBadge class="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">{{
        _element.estado
      }}</span>
    </div>
  `,
})
export class EstadoConvocatoria {
  private readonly _context = injectFlexRenderContext<CellContext<Convocatoria, unknown>>();
  protected readonly _element = this._context.row.original;
}
