import { Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { type HeaderContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  imports: [HlmButtonImports, NgIcon, HlmIconImports],
  providers: [provideIcons({ lucideArrowUpDown })],
  template: `
    <button
      hlmBtn
      size="sm"
      variant="ghost"
      (click)="filterClick()"
      [class.capitalize]="header() === ''"
    >
      {{ _header() }}
      <ng-icon hlm size="sm" name="lucideArrowUpDown" />
    </button>
  `,
})
export class OrdenarColumnas<T> {
  protected readonly _context = injectFlexRenderContext<HeaderContext<T, unknown>>();
  protected filterClick() {
    this._context.column.toggleSorting(this._context.column.getIsSorted() === 'asc');
  }
  public readonly header = input('');

  protected readonly _header = computed(() => {
    const text = this.header() === '' ? this._context.column.id : this.header();
    return text.replace(/([a-z])([A-Z])/g, '$1 $2');
  });
}
