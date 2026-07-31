import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  TrackByFunction,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type Convocatoria } from '../../../models/convocatorias.models';
import { BarraAccionesConvocatorias } from './barra-acciones';
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
import { OrdenarColumnas } from '../componentes/boton-ordenar-columna';
import { BotonAccionesColumna } from './boton-acciones-columna';
import { SeleccionFilaTabla, SeleccionTituloTabla } from '../componentes/columna-seleccion';
import { EstadoConvocatoria } from './estado-convocatoria-columna';
import { HlmButton } from '@spartan-ng/helm/button';
import { AbrirConvocatorias } from '../../modales/convocatorias/modal-abrir-convocatorias';
import { ConvocatoriasService } from '../../../services/convocatorias.service';
import { toSignal } from '@angular/core/rxjs-interop';

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
    AbrirConvocatorias,
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
  templateUrl: './tabla-convocatorias.html',
})
export class TablaConvocatorias implements OnInit {
  private convocatoriasService = inject(ConvocatoriasService);

  //Señales del servicio
  cargando = this.convocatoriasService.cargando;
  error = this.convocatoriasService.error;

  // Datos de la tabla con toSignal
  public convocatoriasData = toSignal(
    this.convocatoriasService.obtenerConvocatorias(),
    { initialValue: [] }, // Valor inicial para evitar undefined
  );

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
      cell: (info) => info.getValue(),
    },

    {
      accessorKey: 'descripcion',
      id: 'descripcion',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },

    {
      accessorKey: 'fechaInicio',
      id: 'fechaInicio',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },

    {
      accessorKey: 'fechaFin',
      id: 'fechaFin',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },

    {
      accessorKey: 'cicloEscolar',
      id: 'cicloEscolar',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },

    {
      accessorKey: 'cupoMaximo',
      id: 'cupoMaximo',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
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
      cell: () =>
        flexRenderComponent(BotonAccionesColumna, {
          inputs: { ver: this.abrirConvocatoria },
        }),
    },
  ];

  protected readonly convocatoriaSeleccionada = signal<Convocatoria | null>(null);
  protected readonly modalAbierto = signal(false);

  protected readonly abrirConvocatoria = (convocatoria: Convocatoria) => {
    this.convocatoriaSeleccionada.set(convocatoria);
    this.modalAbierto.set(true);
  };

  protected readonly cerrarConvocatoria = () => {
    this.modalAbierto.set(false);
    this.convocatoriaSeleccionada.set(null);
  };

  private readonly _orden = signal<SortingState>([]);

  private readonly _paginacion = signal<PaginationState>({
    pageSize: 20,
    pageIndex: 0,
  });

  public readonly table = createAngularTable<Convocatoria>(() => ({
    data: this.convocatoriasData(),
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

  //Cargar datos al inicializar
  ngOnInit(): void {
    this.cargarDatos();
  }

  //Método para cargar datos desde la API
  cargarDatos(): void {
    this.convocatoriasService.obtenerConvocatorias();
  }

  recargarDatos(): void {
    this.convocatoriasService.limpiarError();
    this.cargarDatos();
  }
}
