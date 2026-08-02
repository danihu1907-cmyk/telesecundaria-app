import { Component, input, output } from '@angular/core';
import { Convocatoria } from '../../../../models/convocatorias.models';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButton } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoader, lucideCircleX } from '@ng-icons/lucide';

@Component({
  selector: 'modal-cancelar-convocatoria',
  imports: [HlmAlertDialogImports, HlmDropdownMenuImports, HlmButtonImports, HlmButton, NgIcon],
  providers: [provideIcons({ lucideLoader, lucideCircleX })],
  templateUrl: './modal-cancelar-convocatoria.html',
})
export class ModalCancelarConvocatoria {
  readonly convocatoria = input.required<Convocatoria>();
  readonly confirmar = output<void>();
  readonly cargando = input(false);
}
