import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { Convocatoria } from '../../../models/convocatorias.models';

@Component({
  selector: 'titulo-columna',
  imports: [],
  providers: [provideIcons({ lucideEllipsis })],
  template: `
    <div
      class="text-foreground inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold"
    >
      {{ _element.titulo }}
    </div>
  `,
})
export class TituloColumna {
  private readonly _context = injectFlexRenderContext<CellContext<Convocatoria, unknown>>();
  protected readonly _element = this._context.row.original;
}
