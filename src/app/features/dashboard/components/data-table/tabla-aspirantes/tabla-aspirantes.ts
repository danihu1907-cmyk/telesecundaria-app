import { ChangeDetectionStrategy, Component, OnInit, signal, TrackByFunction } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import {
  ColumnDef,
  createAngularTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  PaginationState,
  FlexRender,
} from '@tanstack/angular-table';
import { AspirantesService } from '../../../services/aspirantes.service';
import { Aspirantes } from '../../../models/aspirantes.models';
import {
  SeleccionTituloTabla,
  SeleccionFilaTabla,
} from '../../data-table/componentes/columna-seleccion';
import { OrdenarColumnas } from '../../data-table/componentes/boton-ordenar-columna';
import { BotonAccionesColumna } from '../tabla-aspirantes/boton-acciones-columna';
import { flexRenderComponent } from '@tanstack/angular-table';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
  lucideLoader,
} from '@ng-icons/lucide';
import { BarraAccionesAspirantes } from './barra-acciones-asp';
import { EstatusAspirantes } from './estado-aspirantes-columna';

@Component({
  selector: 'tabla-aspirantes',
  imports: [
    HlmButton,
    FlexRender,
    HlmIcon,
    FormsModule,
    NgIcon,
    HlmSelectImports,
    HlmTableImports,
    BarraAccionesAspirantes,
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
  templateUrl: './tabla-aspirantes.html',
})
export class TablaAspirantes implements OnInit {
  private aspirantesService = inject(AspirantesService); // Update service name

  cargando = this.aspirantesService.cargando;
  error = this.aspirantesService.error;

  private aspirantesData = toSignal(
    this.aspirantesService.obtenerAspirantes(), // Update method name in service
    { initialValue: [] },
  );

  protected readonly trackBy: TrackByFunction<Aspirantes> = (_: number, p: Aspirantes) =>
    p.claveAspirante;

  protected readonly _tamanoPaginasDisponibles = [10, 20, 50, 100];

  protected readonly _tamanoPagina = signal(this._tamanoPaginasDisponibles[1]);

  protected readonly _columnas: ColumnDef<Aspirantes>[] = [
    {
      accessorKey: 'select',
      id: 'select',
      header: () => flexRenderComponent(SeleccionTituloTabla),
      cell: () => flexRenderComponent(SeleccionFilaTabla),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'claveAspirante',
      id: 'claveAspirante',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'nombre',
      id: 'nombre',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'apellidoPaterno',
      id: 'apellidoPaterno',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'apellidoMaterno',
      id: 'apellidoMaterno',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'curp',
      id: 'curp',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'escuelaProcedencia',
      id: 'escuelaProcedencia',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'promedioPrimaria',
      id: 'promedioPrimaria',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'tieneDiscapacidad',
      id: 'tieneDiscapacidad',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => (info.getValue() === true ? 'Sí' : 'No'),
    },
    {
      accessorKey: 'nombreEnfermedad',
      id: 'nombreEnfermedad',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue() || '-',
    },
    {
      accessorKey: 'hermanoPlantel',
      id: 'hermanoPlantel',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => (info.getValue() === true ? 'Sí' : 'No'),
    },
    {
      accessorKey: 'curpHermano',
      id: 'curpHermano',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue() || '-',
    },
    {
      accessorKey: 'estatusAspirante',
      id: 'estatusAspirante',
      filterFn: 'arrIncludesSome',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: () => flexRenderComponent(EstatusAspirantes),
    },
    {
      accessorKey: 'claveConvocatoria',
      id: 'claveConvocatoria',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'claveTutorAspirante',
      id: 'claveTutorAspirante',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'estado',
      id: 'estado',
      header: () => flexRenderComponent(OrdenarColumnas, { inputs: { header: '' } }),
      cell: (info) => info.getValue(),
    },
    {
      id: 'action',
      enableHiding: false,
      cell: () =>
        flexRenderComponent(BotonAccionesColumna, {
          inputs: { ver: this.abrirAspirante },
        }),
    },
  ];

  protected readonly aspiranteSeleccionado = signal<Aspirantes | null>(null);
  protected readonly modalAbierto = signal<boolean>(false);

  protected readonly abrirAspirante = (aspirante: Aspirantes) => {
    this.aspiranteSeleccionado.set(aspirante);
    this.modalAbierto.set(true);
  };

  protected readonly cerrarAspirante = () => {
    this.modalAbierto.set(false);
    this.aspiranteSeleccionado.set(null);
  };

  private readonly _orden = signal<SortingState>([]);

  private readonly _paginacion = signal<PaginationState>({
    pageSize: 20,
    pageIndex: 0,
  });

  public readonly table = createAngularTable<Aspirantes>(() => ({
    data: this.aspirantesData(),
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

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.aspirantesService.obtenerAspirantes();
  }

  recargarDatos(): void {
    this.aspirantesService.limpiarError();
    this.cargarDatos();
  }
}
