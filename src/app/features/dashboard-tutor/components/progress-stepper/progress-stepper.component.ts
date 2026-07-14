import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-stepper.component.html',
  styleUrl: './progress-stepper.component.css',
})
export class ProgressStepperComponent {
  pasoActual = input<number>(1);
  finalizado = input<boolean>(false);
}
