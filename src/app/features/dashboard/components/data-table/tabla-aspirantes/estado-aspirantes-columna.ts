import { Component } from '@angular/core';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { Aspirantes, ESTADO_COLORS } from '../../../models/aspirantes.models';
import { HlmBadge } from '@spartan-ng/helm/badge';

@Component({
  selector: 'estatus-aspirantes-columna',
  imports: [HlmBadge],
  template: `
    <div class="flex items-center">
      <span hlmBadge [class]="getBadgeClasses(_element.estatusAspirante)">{{
        _element.estatusAspirante
      }}</span>
    </div>
  `,
})
export class EstatusAspirantes {
  private readonly _context = injectFlexRenderContext<CellContext<Aspirantes, unknown>>();
  protected readonly _element = this._context.row.original;

  protected getBadgeClasses(estado: string): string {
    console.log(estado);
    const colors = ESTADO_COLORS[estado as keyof typeof ESTADO_COLORS];
    return colors ? `${colors.bg} ${colors.text}` : 'bg-gray-100 text-gray-800';
  }
}
