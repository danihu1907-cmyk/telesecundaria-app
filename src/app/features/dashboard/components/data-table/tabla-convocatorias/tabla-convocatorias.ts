import { Component, inject, signal, TrackByFunction } from '@angular/core';
import { Convocatoria, DATA_CONVOCATORIAS } from '../../../models/convocatorias.models';
import { BarraAccionesConvocatorias } from './barra-acciones-convocatorias';
import { lucideLoader } from '@ng-icons/lucide';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import {
  type ColumnDef,
  type ColumnFiltersState,
  createAngularTable,
  FlexRender,
  flexRenderComponent,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  type VisibilityState,
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

@Component({
  selector: 'tabla-convocatorias',
  imports: [
    BarraAccionesConvocatorias,
    FlexRender,
    HlmIcon,
    NgIcon,
    HlmSelectImports,
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
    <div class="hidden h-full flex-1 flex-col space-y-4 rounded-lg border p-8 py-6 md:flex">
      <!---->
      <barra-acciones-convocatorias table="tablaConvocatorias"></barra-acciones-convocatorias>
      <!---->
      <div class="max-h-175 w-full overflow-auto rounded-md border">
        @defer {
          <div hlmTableContainer>
            <table hlmTable>
              <thead hlmTHead class="bg-background sticky top-0 z-10">
                @for (headerGroup of tabla.getHeaderGroups(); track headerGroup.id) {
                  <tr hlmTr>
                    @for (header of headerGroup.headers; track header.id) {
                      <th hlmTh [attr.colSpan]="header.colSpan">
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
              <tbody hlmTBody class="w-full">
                @for (row of tabla.getRowModel().rows; track row.id) {
                  <tr
                    hlmTr
                    [attr.key]="row.id"
                    [attr.data-state]="row.getIsSelected() && 'selected'"
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
                      Sin resultados.
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

      <!-- footer de acciones de paginador -->
      <div class="mt-4 flex flex-col justify-between sm:flex-row sm:items-center">
        <div class="mt-2 flex gap-8 sm:mt-0">
          <div class="flex gap-2">
            <!-- Selector de convocatorias por página -->
            <span hlmLabel>Convocatorias por página:</span>
            <hlm-select>
              <hlm-select-trigger size="sm" class="mr-1 inline-flex h-8 w-fit">
                <hlm-select-value placeholder="{{ _paginasDisponibles[0] }}" />
              </hlm-select-trigger>
              <hlm-select-content *hlmSelectPortal>
                <hlm-select-group>
                  @for (size of _paginasDisponibles; track size) {
                    <hlm-select-item [value]="size">
                      {{ size === 100 ? 'All' : size }}
                    </hlm-select-item>
                  }
                </hlm-select-group>
              </hlm-select-content>
            </hlm-select>
          </div>

          <!-- Se acaba el paginador -->

          <span hlmLabel
            >Page {{ tabla.getState().pagination.pageIndex + 1 }} of
            {{ tabla.getPageCount() }}</span
          >

          <!-- Botones de navegación de paginación -->

          <div class="flex space-x-1">
            <button
              size="icon-sm"
              variant="outline"
              hlmBtn
              [disabled]="!tabla.getCanPreviousPage()"
              (click)="tabla.firstPage()"
            >
              <ng-icon hlm name="lucideChevronsLeft" size="sm" />
            </button>
            <button
              size="icon-sm"
              variant="outline"
              hlmBtn
              [disabled]="!tabla.getCanPreviousPage()"
              (click)="tabla.previousPage()"
            >
              <ng-icon hlm name="lucideChevronLeft" size="sm" />
            </button>
            <button
              size="icon-sm"
              variant="outline"
              hlmBtn
              [disabled]="!tabla.getCanNextPage()"
              (click)="tabla.nextPage()"
            >
              <ng-icon hlm name="lucideChevronRight" size="sm" />
            </button>
            <button
              size="icon-sm"
              variant="outline"
              hlmBtn
              [disabled]="!tabla.getCanNextPage()"
              (click)="tabla.lastPage()"
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

  protected readonly _paginasDisponibles = [10, 20, 50, 100];

  protected readonly _tamanoPagina = signal(this._paginasDisponibles[1]); // default tamano 20 por pagina

  protected readonly _columnas: ColumnDef<Convocatoria>[] = [
    {
      accessorKey: 'clave',
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

  public readonly tabla = createAngularTable<Convocatoria>(() => ({
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
