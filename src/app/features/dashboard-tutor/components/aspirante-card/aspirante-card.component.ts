import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AspiranteTarjetaDashboard } from '../../models/tutorado.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-aspirante-card',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './aspirante-card.component.html',
  styleUrl: './aspirante-card.component.css',
})
export class AspiranteCardComponent {
  aspirante = input.required<AspiranteTarjetaDashboard>();
  completarDocumentos = output<string>();
}
