import { Component } from '@angular/core';
import { EmptyState } from '../../components/empty-state/empty-state';
import { TablaConvocatorias } from '../../components/data-table/tabla-convocatorias/tabla-convocatorias';

@Component({
  selector: 'app-convocatorias',
  imports: [TablaConvocatorias],
  host: {
    class: 'flex min-h-0 min-w-0 h-full w-full flex-1 overflow-hidden',
  },
  templateUrl: './convocatorias.html',
  styleUrl: './convocatorias.css',
})
export class Convocatorias {}
