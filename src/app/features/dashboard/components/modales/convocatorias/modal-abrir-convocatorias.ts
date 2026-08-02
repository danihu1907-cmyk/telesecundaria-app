import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { CommonModule } from '@angular/common';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { lucidePlus, lucidePencil, lucideCircleX } from '@ng-icons/lucide';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { Convocatoria } from '../../../models/convocatorias.models';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { ConvocatoriasService } from '../../../services/convocatorias.service';
import { EditarConvocatorias } from './modal-editar-convocatorias';

@Component({
  selector: 'modal-abrir-convocatorias',
  standalone: true,
  imports: [
    HlmButtonImports,
    HlmDrawerImports,
    HlmFieldImports,
    HlmInputImports,
    HlmTextareaImports,
    HlmDatePickerImports,
    CommonModule,
    NgIcon,
    HlmSheetImports,
    HlmBadge,
    HlmAlertDialogImports,
    EditarConvocatorias,
  ],
  providers: [
    provideHlmDatePickerConfig({ autoCloseOnSelect: true }),
    provideIcons({
      lucidePlus,
      lucidePencil,
      lucideCircleX,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './abrir-convocatoria.html',
})
export class AbrirConvocatorias {
  //inputs
  detallesConvocatoria = input<Convocatoria | null>(null);
  abierto = input(false);

  //outputs
  cerrado = output<void>();
  readonly convocatoriaEliminada = output<string>();

  private readonly _convocatoriasService = inject(ConvocatoriasService);

  //estado
  protected readonly eliminando = signal(false);
  protected readonly modalEditarAbierto = signal(false);

  //computed
  puedeEditar(): boolean {
    const convocatoria = this.detallesConvocatoria();
    if (!convocatoria) return false;
    return convocatoria.estado === 'Publicada' || convocatoria.estado === 'Programada';
  }

  //eliminar convocatoria
  protected readonly eliminarConvocatoria = async (ctx: { close?: () => void }) => {
    const convocatoria = this.detallesConvocatoria();
    if (!convocatoria) {
      return;
    }
    this.eliminando.set(true);
    const exito = await this._convocatoriasService.cancelarConvocatoria(convocatoria);
    this.eliminando.set(false);

    if (exito) {
      this.convocatoriaEliminada.emit(convocatoria.claveConvocatoria);
    }
  };

  private BADGE_COLORS = {
    Activa: {
      bg: 'bg-green-100 dark:bg-green-950',
      text: 'text-green-700 dark:text-green-300',
    },
    Inactiva: {
      bg: 'bg-red-100 dark:bg-red-950',
      text: 'text-red-700 dark:text-red-300',
    },
    Publicada: {
      bg: 'bg-green-100 dark:bg-green-950',
      text: 'text-green-700 dark:text-green-300',
    },
    Cerrada: {
      bg: 'bg-red-100 dark:bg-red-950',
      text: 'text-red-700 dark:text-red-300',
    },
    Programada: {
      bg: 'bg-yellow-100 dark:bg-yellow-950',
      text: 'text-yellow-700 dark:text-yellow-300',
    },
  };

  protected getBadgeClasses(badge: keyof typeof this.BADGE_COLORS | undefined): string {
    if (!badge) {
      return 'bg-gray-100 text-gray-700';
    }

    const colors = this.BADGE_COLORS[badge];

    return `${colors.bg} ${colors.text}`;
  }
}
