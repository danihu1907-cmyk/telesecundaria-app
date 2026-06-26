import { Component, signal, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type Convocatoria, DATA_CONVOCATORIAS } from '../../../models/convocatorias.models';
import { BarraAccionesConvocatorias } from './barra-acciones-convocatorias';
import { lucideLoader } from '@ng-icons/lucide';
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
import { OrdenarColumnas } from '../componentes/boton-ordenar-columna';
import { BotonAccionesColumna } from '../componentes/boton-acciones-columna';
import { SeleccionFilaTabla, SeleccionTituloTabla } from '../componentes/columna-seleccion';
import { TituloColumna } from '../componentes/titulo-columna';
import { EstadoConvocatoria } from '../componentes/estado-convocatoria-columna';
import { DescripcionColumna } from '../componentes/descripcion-columna';
import { FechaFinColumna } from '../componentes/fecha-fin-columna';
import { FechaInicioColumna } from '../componentes/fecha-inicio-columna';

@Component({
  selector: 'tabla-convocatorias',
  imports: [
    BarraAccionesConvocatorias,
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
  providers: [provideIcons({ lucideLoader })],
  host: {
    class: 'w-full',
  },
  template: `
    <div class="hidden h-full flex-1 flex-col space-y-4 rounded-lg  p-6 py-6 md:flex">
      <div class="flex items-center justify-between space-y-2">
        <!-- titulo de la tabla -->
        <div class="flex w-full items-center justify-between">
          <p class="font-bold text-muted-foreground">Lista de convocatorias</p>
          <barra-acciones-convocatorias table="table" />
        </div>
        <!-- titulo de la tabla -->
      </div>

      <div class="max-h-175 w-full overflow-auto rounded-md border border-border">
        @defer {
          <div hlmTableContainer class="spartan-table-container container">
            <table hlmTable class="spartan-table  ">
              <thead hlmTHead class="spartan-table-header bg-background sticky top-0 z-10">
                @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
                  <tr hlmTr class="border-b border-border">
                    @for (header of headerGroup.headers; track header.id) {
                      <th hlmTh [attr.colSpan]="header.colSpan" class="">
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
                      <td hlmTd>
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
      <div class="mt-4 flex flex-col justify-between sm:flex-row sm:items-center">
        <span class="text-muted-foreground text-sm">
          {{ table.getSelectedRowModel().rows.length }} of {{ table.getRowCount() }} Filas
          seleccionadas
        </span>
        <div class="mt-2 flex gap-8 sm:mt-0">
          <div class="flex gap-2">
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

          <span hlmLabel
            >Pagina {{ table.getState().pagination.pageIndex + 1 }} de
            {{ table.getPageCount() }}</span
          >

          <div class="flex space-x-1">
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
