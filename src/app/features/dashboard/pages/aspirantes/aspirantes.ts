import { Component } from '@angular/core';
import { TablaAspirantes } from '../../components/data-table/tabla-aspirantes/tabla-aspirantes';

@Component({
  selector: 'app-aspirantes',
  imports: [TablaAspirantes],
  host: {
    class: 'flex min-h-0 min-w-0 h-full w-full flex-1 overflow-hidden',
  },
  templateUrl: './aspirantes.html',
  styleUrl: './aspirantes.css',
})
export class Aspirantes {}
