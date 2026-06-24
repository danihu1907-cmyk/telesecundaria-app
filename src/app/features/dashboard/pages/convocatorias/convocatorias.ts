import { Component } from '@angular/core';
import { EmptyState } from '../../components/empty-state/empty-state';
import { TablaConvocatorias } from '../../components/data-table/tabla-convocatorias/tabla-convocatorias';

@Component({
  selector: 'app-convocatorias',
  imports: [TablaConvocatorias],
  templateUrl: './convocatorias.html',
  styleUrl: './convocatorias.css',
})
export class Convocatorias {}
