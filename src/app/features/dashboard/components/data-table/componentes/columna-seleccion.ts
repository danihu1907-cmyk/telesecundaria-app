import { Component } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import {
  type CellContext,
  type HeaderContext,
  injectFlexRenderContext,
} from '@tanstack/angular-table';
import { HlmCheckbox } from '../../../../../../../libs/ui/checkbox/src';

@Component({
  imports: [HlmCheckbox],
  host: {
    class: 'flex',
    'aria-label': 'Select all',
  },
  template: `
    <hlm-checkbox
      [checked]="_context.table.getIsAllRowsSelected()"
      [indeterminate]="_context.table.getIsSomeRowsSelected()"
      (checkedChange)="_context.table.toggleAllRowsSelected()"
    />
  `,
})
export class SeleccionTituloTabla<T> {
  protected readonly _context = injectFlexRenderContext<HeaderContext<T, unknown>>();
}

@Component({
  imports: [HlmCheckbox],
  host: {
    class: 'flex',
    'aria-label': 'Select Row',
  },
  template: `
    <hlm-checkbox
      [checked]="_context.row.getIsSelected()"
      (checkedChange)="_context.row.getToggleSelectedHandler()($event)"
    />
  `,
})
export class SeleccionFilaTabla<T> {
  protected readonly _context = injectFlexRenderContext<CellContext<T, unknown>>();
}
