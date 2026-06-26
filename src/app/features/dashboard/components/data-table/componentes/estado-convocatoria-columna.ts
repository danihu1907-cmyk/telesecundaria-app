import { Component } from '@angular/core';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { Convocatoria, ESTADO_COLORS } from '../../../models/convocatorias.models';
import { HlmBadge } from '@spartan-ng/helm/badge';

@Component({
  selector: 'estado-convocatoria-columna',
  imports: [HlmBadge],
  template: `
    <div class="flex items-center">
      <span hlmBadge [class]="getBadgeClasses(_element.estado)">{{ _element.estado }}</span>
    </div>
  `,
})
export class EstadoConvocatoria {
  private readonly _context = injectFlexRenderContext<CellContext<Convocatoria, unknown>>();
  protected readonly _element = this._context.row.original;

  protected getBadgeClasses(estado: string): string {
    const colors = ESTADO_COLORS[estado as keyof typeof ESTADO_COLORS];
    if (!colors) return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    return `${colors.bg} ${colors.text}`;
  }
}
