import { Component, inject, signal } from '@angular/core';
import { TablaAspirantes } from './tabla-aspirantes';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucideCirclePlus, lucideX } from '@ng-icons/lucide';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { Estatus } from '../../../models/aspirantes.models';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
  selector: 'barra-acciones-aspirantes',
  imports: [
    HlmPopoverImports,
    NgIcon,
    HlmIcon,
    HlmCommandImports,
    HlmCheckbox,
    HlmButton,
    HlmInput,
  ],
  providers: [provideIcons({ lucideCirclePlus, lucideX })],
  host: { class: 'block' },
  template: `
    <div class="wip-table-search flex flex-col justify-between gap-4 sm:flex-row">
      <div class="flex flex-col justify-between gap-2 sm:flex-row">
        <!-- Barra de busqueda -->
        <input
          hlmInput
          class="h-8 w-full md:w-80"
          placeholder="Buscar aspirantes por nombre..."
          (input)="barraBusquedaAspirantes($event)"
        />

        <!-- Filtro de estado -->
        <hlm-popover
          [state]="_estadoEstatus()"
          (stateChanged)="statusStateChanged($event)"
          sideOffset="5"
          closeDelay="100"
        >
          <button hlmBtn hlmPopoverTrigger variant="outline" size="sm" class="border-dashed">
            <ng-icon hlm name="lucideCirclePlus" class="mr-2" size="sm" />
            Estatus

            @if (_filtroEstatus().length) {
              <div
                data-orientation="vertical"
                role="none"
                class="bg-border mx-2 h-4 w-px shrink-0"
              ></div>

              <div class="flex gap-1">
                @for (estatus of _filtroEstatus(); track estatus) {
                  <span class=" bg-secondary text-secondary-foreground rounded px-1 py-0.5 text-xs">
                    {{ estatus }}
                  </span>
                }
              </div>
            }
          </button>
          <hlm-command *hlmPopoverPortal="let ctx" hlmPopoverContent class="w-50 p-0">
            <hlm-command-list>
              <div *hlmCommandEmptyState hlmCommandEmpty>Sin resultados</div>
              <hlm-command-group>
                @for (estatus of _estatus(); track estatus) {
                  <button hlm-command-item [value]="estatus" (selected)="statusSelected(estatus)">
                    <hlm-checkbox class="mr-2" [checked]="isStatusSelected(estatus)" />
                    <!-- Mostrar el estado sin ícono -->
                    <span>{{ estatus }}</span>
                  </button>
                }
              </hlm-command-group>
            </hlm-command-list>
          </hlm-command>
        </hlm-popover>

        <!-- Reset de filtros -->
        @if (_filtroEstatus().length) {
          <button hlmBtn variant="ghost" size="sm" (click)="resetFilters()">
            <ng-icon hlm name="lucideX" class="ml-2" size="sm" />
            Borrar filtros
          </button>
        }
      </div>
    </div>
  `,
})
export class BarraAccionesAspirantes {
  private readonly _tableComponent = inject(TablaAspirantes);

  protected readonly _table = this._tableComponent.table;

  protected readonly _filtroEstatus = signal<Estatus[]>([]);
  protected readonly _estatus = signal(['Aceptado', 'En proceso', 'Rechazado'] satisfies Estatus[]);
  protected readonly _estadoEstatus = signal<'closed' | 'open'>('closed');

  protected barraBusquedaAspirantes(event: Event) {
    this._table.getColumn('nombre')?.setFilterValue((event.target as HTMLInputElement).value);
  }

  isStatusSelected(estatus: Estatus): boolean {
    return this._filtroEstatus().some((s) => s === estatus);
  }

  statusStateChanged(state: 'open' | 'closed') {
    this._estadoEstatus.set(state);
  }

  statusSelected(estatus: Estatus): void {
    const current = this._filtroEstatus();
    const index = current.indexOf(estatus);
    if (index === -1) {
      this._filtroEstatus.set([...current, estatus]);
    } else {
      this._filtroEstatus.set(current.filter((s) => s !== estatus));
    }
    this._table.getColumn('estatusAspirante')?.setFilterValue(this._filtroEstatus());
  }

  resetFilters(): void {
    this._filtroEstatus.set([]);
    this._table.resetColumnFilters();
  }
}
