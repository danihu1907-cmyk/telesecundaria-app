import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { Convocatoria } from '../../../../models/convocatorias.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cupo-maximo',
  imports: [CommonModule],
  providers: [provideIcons({ lucideEllipsis })],
  template: ` {{ _element.cupoMaximo }} `,
})
export class CupoMaximo {
  private readonly _context = injectFlexRenderContext<CellContext<Convocatoria, unknown>>();
  protected readonly _element = this._context.row.original;
}
