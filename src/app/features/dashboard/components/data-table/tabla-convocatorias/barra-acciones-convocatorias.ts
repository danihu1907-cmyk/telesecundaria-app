import { Component, inject, signal } from '@angular/core';
import { TablaConvocatorias } from './tabla-convocatorias';
import {
  HlmPopover,
  HlmPopoverPortal,
  HlmPopoverTrigger,
} from '../../../../../../../libs/ui/popover/src';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucideCirclePlus, lucideX } from '@ng-icons/lucide';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { EstadoConvocatoria } from '../../../models/convocatorias.models';
import {
  HlmCommand,
  HlmCommandInput,
  HlmCommandList,
  HlmCommandGroup,
  HlmCommandEmptyState,
  HlmCommandItem,
} from '../../../../../../../libs/ui/command/src';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
  selector: 'barra-acciones-convocatorias',
  imports: [
    HlmPopover,
    HlmPopoverTrigger,
    NgIcon,
    HlmIcon,
    HlmCommand,

    HlmCommandItem,
    HlmCommandList,
    HlmCommandGroup,
    HlmCheckbox,
    HlmPopoverPortal,
    HlmCommandEmptyState,
    HlmButton,
    HlmInput,
  ],
  providers: [provideIcons({ lucideCirclePlus, lucideX })],
  host: { class: 'block' },
  template: `
    <div class="wip-table-search flex flex-col justify-between gap-4 pb-4 sm:flex-row">
      <div class="flex flex-col justify-between gap-2 sm:flex-row">
        <!-- Barra de busqueda -->
        <input
          hlmInput
          class="h-8 w-full md:w-80"
          placeholder="Buscar convocatorias..."
          (input)="barraBusquedaConvocatorias($event)"
        />

        <!-- Filtro de estado -->
        <hlm-popover
          [state]="_estadoEstatus()"
          (stateChanged)="statusStateChanged($event)"
          sideOffset="5"
          closeDelay="100"
          align="start"
        >
          <button hlmBtn hlmPopoverTrigger variant="outline" size="sm" class="border-dashed">
            <ng-icon hlm name="lucideCirclePlus" class="mr-2" size="sm" />
            Estado

            @if (_filtroEstatus().length) {
              <div
                data-orientation="vertical"
                role="none"
                class="bg-border mx-2 h-4 w-px shrink-0"
              ></div>

              <div class="flex gap-1">
                @for (estado of _filtroEstatus(); track estado) {
                  <span class=" bg-secondary text-secondary-foreground rounded px-1 py-0.5 text-xs">
                    {{ estado }}
                  </span>
                }
              </div>
            }
          </button>
          <hlm-command *hlmPopoverPortal="let ctx" hlmPopoverContent class="w-50 p-0">
            <hlm-command-list>
              <div *hlmCommandEmptyState hlmCommandEmpty>Sin resultados</div>
              <hlm-command-group>
                @for (estado of _estatus(); track estado) {
                  <button hlm-command-item [value]="estado" (selected)="statusSelected(estado)">
                    <hlm-checkbox class="mr-2" [checked]="isStatusSelected(estado)" />
                    <!-- Mostrar el estado sin ícono -->
                    <span>{{ estado }}</span>
                  </button>
                }
              </hlm-command-group>
            </hlm-command-list>
          </hlm-command>
        </hlm-popover>

        <!-- Reset de filtros -->
        @if (_filtroEstatus().length) {
          <button hlmBtn variant="ghost" size="sm" align="end" (click)="resetFilters()">
            <ng-icon hlm name="lucideX" class="ml-2" size="sm" />
            Borrar filtros
          </button>
        }
      </div>
    </div>
  `,
})
export class BarraAccionesConvocatorias {
  private readonly _tableComponent = inject(TablaConvocatorias);

  protected readonly _table = this._tableComponent.table;

  protected readonly _filtroEstatus = signal<EstadoConvocatoria[]>([]);
  protected readonly _estatus = signal([
    'Activa',
    'Cerrada',
    'En Pausa',
  ] satisfies EstadoConvocatoria[]);
  protected readonly _estadoEstatus = signal<'closed' | 'open'>('closed');

  protected barraBusquedaConvocatorias(event: Event) {
    this._table.getColumn('titulo')?.setFilterValue((event.target as HTMLInputElement).value);
  }

  isStatusSelected(estado: EstadoConvocatoria): boolean {
    return this._filtroEstatus().some((s) => s === estado);
  }

  statusStateChanged(state: 'open' | 'closed') {
    this._estadoEstatus.set(state);
  }

  statusSelected(estado: EstadoConvocatoria): void {
    const current = this._filtroEstatus();
    const index = current.indexOf(estado);
    if (index === -1) {
      this._filtroEstatus.set([...current, estado]);
    } else {
      this._filtroEstatus.set(current.filter((s) => s !== estado));
    }
    this._table.getColumn('estado')?.setFilterValue(this._filtroEstatus());
  }

  resetFilters(): void {
    this._filtroEstatus.set([]);
    this._table.resetColumnFilters();
  }
}
