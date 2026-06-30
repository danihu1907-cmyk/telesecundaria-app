import { ChangeDetectionStrategy, Component, signal, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type Convocatoria, DATA_CONVOCATORIAS } from '../../../models/convocatorias.models';
import { BarraAccionesConvocatorias } from './barra-acciones-convocatorias';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
  lucideLoader,
} from '@ng-icons/lucide';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  type ColumnDef,
  createAngularTable,
  FlexRender,
  flexRenderComponent,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
} from '@tanstack/angular-table';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { provideIcons, NgIcon } from '@ng-icons/core';
import {
  HlmSelect,
  HlmSelectTrigger,
  HlmSelectValue,
  HlmSelectContent,
  HlmSelectGroup,
  HlmSelectItem,
} from '../../../../../../../libs/ui/select/src';
import { OrdenarColumnas } from './componentes/boton-ordenar-columna';
import { BotonAccionesColumna } from './componentes/boton-acciones-columna';
import { SeleccionFilaTabla, SeleccionTituloTabla } from './componentes/columna-seleccion';
import { TituloColumna } from './componentes/titulo-columna';
import { EstadoConvocatoria } from './componentes/estado-convocatoria-columna';
import { DescripcionColumna } from './componentes/descripcion-columna';
import { FechaFinColumna } from './componentes/fecha-fin-columna';
import { FechaInicioColumna } from './componentes/fecha-inicio-columna';
import { CicloEscolar } from './componentes/ciclo-escolar';
import { CupoMaximo } from './componentes/cupo-maximo';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
  selector: 'tabla-convocatorias',
  imports: [
    BarraAccionesConvocatorias,
    HlmButton,
    FlexRender,
    HlmIcon,
    FormsModule,
    NgIcon,
    HlmSelectImports,
    HlmTableImports,
    HlmSelect,
    HlmSelectTrigger,
    HlmSelectValue,
    HlmSelectContent,
    HlmSelectGroup,
    HlmSelectItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideLoader,
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsLeft,
      lucideChevronsRight,
    }),
  ],
  host: {
    class: 'flex min-h-0 min-w-0 h-full w-full flex-1 overflow-hidden',
  },
  template: `
    <div
      class="flex h-full min-h-0 min-w-0 max-w-full flex-1 flex-col gap-4 overflow-hidden p-3 sm:p-4 md:p-6"
    >
      <div class="flex w-full min-w-0 flex-col lg:flex-row lg:items-center lg:justify-between">
        <!-- titulo de la tabla -->
        <div class="flex w-full min-w-0 flex-wrap items-center justify-between">
          <p class="truncate font-bold text-muted-foreground">Lista de convocatorias</p>
          <barra-acciones-convocatorias table="table" />
        </div>
        <!-- titulo de la tabla -->
      </div>

      <!-- contenedor de la tabla -->
      <div class="min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg border border-border">
        @defer {
          <div
            hlmTableContainer
            class="h-full w-full min-h-0 min-w-0 overflow-y-auto overflow-x-auto overscroll-contain"
          >
            <table hlmTable class="w-full min-w-4xl table-auto  ">
              <thead hlmTHead class="spartan-table-header bg-background sticky top-0 z-10">
                @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
                  <tr hlmTr class="border-b border-border transition-colors">
                    @for (header of headerGroup.headers; track header.id) {
                      <th
                        hlmTh
                        [attr.colSpan]="header.colSpan"
                        [class.px-0]="header.column.id !== 'select'"
                        [class.px-4]="header.column.id === 'select'"
                      >
                        @if (!header.isPlaceholder) {
                          <ng-container
                            *flexRender="
                              header.column.columnDef.header;
                              props: header.getContext();
                              let headerText
                            "
                          >
                            <div [innerHTML]="headerText"></div>
                          </ng-container>
                        }
                      </th>
                    }
                  </tr>
                }
              </thead>
              <tbody hlmTBody class="spartan-table-body w-full">
                @for (row of table.getRowModel().rows; track row.id) {
                  <tr
                    hlmTr
                    [attr.key]="row.id"
                    [attr.data-state]="row.getIsSelected() && 'selected'"
                    class="border-b border-border"
                  >
                    @for (cell of row.getVisibleCells(); track $index) {
                      <td hlmTd class="px-4">
                        <ng-container
                          *flexRender="
                            cell.column.columnDef.cell;
                            props: cell.getContext();
                            let cell
                          "
                        >
                          <div [innerHTML]="cell"></div>
                        </ng-container>
                      </td>
                    }
                  </tr>
                } @empty {
                  <tr hlmTr>
                    <td hlmTd class="h-24 text-center" [attr.colspan]="_columnas.length">
                      Sin resultados
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @placeholder {
          <div class="flex h-96 items-center justify-center">
            <ng-icon name="lucideLoader" class="h-4 w-4 animate-spin" />
          </div>
        }
      </div>

      <!-- footer con paginacion -->
      <div
        class="mt-2 flex w-full min-w-0 flex-col gap-3 lg:mt-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <span class="text-muted-foreground text-sm wrap-break-word">
          {{ table.getSelectedRowModel().rows.length }} of {{ table.getRowCount() }} Filas
          seleccionadas
        </span>

        <div class="mt-1 flex min-w-0 flex-wrap items-center gap-3 sm:mt-0 sm:gap-6">
          <div class="flex min-w-0 items-center gap-2">
            <span hlmLabel>Filas por página:</span>
            <hlm-select
              [ngModel]="table.getState().pagination.pageSize"
              (ngModelChange)="table.setPageSize($event); table.resetPageIndex()"
            >
              <hlm-select-trigger size="sm" class="mr-1 inline-flex h-8 w-fit">
                <hlm-select-value placeholder="{{ _tamanoPaginasDisponibles[0] }}" />
              </hlm-select-trigger>

              <hlm-select-content *hlmSelectPortal>
                <hlm-select-group>
                  @for (size of _tamanoPaginasDisponibles; track size) {
                    <hlm-select-item [value]="size">
                      {{ size === 10000 ? 'All' : size }}
                    </hlm-select-item>
                  }
                </hlm-select-group>
              </hlm-select-content>
            </hlm-select>
          </div>

          <span hlmLabel class="whitespace-nowrap"
            >Pagina {{ table.getState().pagination.pageIndex + 1 }} de
            {{ table.getPageCount() }}</span
          >

          <div class="ml-auto flex flex-wrap justify-end gap-1 sm:ml-0">
            <button
              size="icon-sm"
              variant="outline"
              hlmBtn
              [disabled]="!table.getCanPreviousPage()"
              (click)="table.firstPage()"
            >
              <ng-icon hlm name="lucideChevronsLeft" size="sm" />
            </button>

            <button
              size="icon-sm"
              variant="outline"
              hlmBtn
              [disabled]="!table.getCanPreviousPage()"
              (click)="table.previousPage()"
            >
              <ng-icon hlm name="lucideChevronLeft" size="sm" />
            </button>

            <button
              size="icon-sm"
              variant="outline"
              hlmBtn
              [disabled]="!table.getCanNextPage()"
              (click)="table.nextPage()"
            >
              <ng-icon hlm name="lucideChevronRight" size="sm" />
            </button>

            <button
              size="icon-sm"
              variant="outline"
              hlmBtn
              [disabled]="!table.getCanNextPage()"
              (click)="table.lastPage()"
            >
              <ng-icon hlm name="lucideChevronsRight" size="sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TablaConvocatorias {
  protected readonly trackBy: TrackByFunction<Convocatoria> = (_: number, p: Convocatoria) =>
    p.claveConvocatoria;

  protected readonly _tamanoPaginasDisponibles = [10, 20, 50, 100];

  protected readonly _tamanoPagina = signal(this._tamanoPaginasDisponibles[1]); // default tamano 20 por pagina

  protected readonly _columnas: ColumnDef<Convocatoria>[] = [
    {
      accessorKey: 'select',
      id: 'select',
      header: () => flexRenderComponent(SeleccionTituloTabla),
      cell: () => flexRenderComponent(SeleccionFilaTabla),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'claveConvocatoria',
      id: 'claveConvocatoria',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'titulo',
      id: 'titulo',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: () => flexRenderComponent(TituloColumna),
    },

    {
      accessorKey: 'descripcion',
      id: 'descripcion',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: () => flexRenderComponent(DescripcionColumna),
    },

    {
      accessorKey: 'fechaInicio',
      id: 'fechaInicio',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: () => flexRenderComponent(FechaInicioColumna),
    },

    {
      accessorKey: 'fechaFin',
      id: 'fechaFin',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: () => flexRenderComponent(FechaFinColumna),
    },

    {
      accessorKey: 'cicloEscolar',
      id: 'cicloEscolar',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: () => flexRenderComponent(CicloEscolar),
    },

    {
      accessorKey: 'cupoMaximo',
      id: 'cupoMaximo',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: () => flexRenderComponent(CupoMaximo),
    },

    {
      accessorKey: 'estado',
      id: 'estado',
      filterFn: 'arrIncludesSome',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: () => flexRenderComponent(EstadoConvocatoria),
    },

    {
      id: 'action',
      enableHiding: false,
      cell: () => flexRenderComponent(BotonAccionesColumna),
    },
  ];

  private readonly _orden = signal<SortingState>([]);

  private readonly _paginacion = signal<PaginationState>({
    pageSize: 20,
    pageIndex: 0,
  });

  public readonly table = createAngularTable<Convocatoria>(() => ({
    data: DATA_CONVOCATORIAS,
    columns: this._columnas,
    state: {
      sorting: this._orden(),
      pagination: this._paginacion(),
    },

    onSortingChange: (updater) => {
      updater instanceof Function ? this._orden.update(updater) : this._orden.set(updater);
    },
    onPaginationChange: (updater) => {
      updater instanceof Function
        ? this._paginacion.update(updater)
        : this._paginacion.set(updater);
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  }));
}
