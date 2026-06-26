import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { Convocatoria } from '../../../models/convocatorias.models';

@Component({
  selector: 'fecha-inicio-columna',
  imports: [],
  providers: [provideIcons({ lucideEllipsis })],
  template: ` {{ _element.fechaInicio }} `,
})
export class FechaInicioColumna {
  private readonly _context = injectFlexRenderContext<CellContext<Convocatoria, unknown>>();
  protected readonly _element = this._context.row.original;
}
