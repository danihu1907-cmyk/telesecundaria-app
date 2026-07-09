import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { CommonModule } from '@angular/common';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { lucidePlus, lucidePencil, lucideArrowLeft } from '@ng-icons/lucide';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { Convocatoria } from '../../models/convocatorias.models';

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
  ],
  providers: [
    provideHlmDatePickerConfig({ autoCloseOnSelect: true }),
    provideIcons({
      lucidePlus,
      lucidePencil,
      lucideArrowLeft,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-drawer
      [state]="abierto() ? 'open' : 'closed'"
      (closed)="cerrado.emit()"
      hlmDrawerTrigger
      direction="right"
    >
      <!-- Modal -->
      <hlm-drawer-content *hlmDrawerPortal="let ctx">
        <hlm-drawer-header>
          <h2 hlmDrawerTitle>{{ detallesConvocatoria()?.titulo }}</h2>
          <p hlmDrawerDescription>
            {{ detallesConvocatoria()?.descripcion }}
          </p>
        </hlm-drawer-header>

        <hlm-field-group class="px-4 pt-4 ">
          <!-- Fechas -->
          <div class="grid grid-cols-2 gap-3">
            <hlm-field class="w-full">
              <label hlmFieldLabel>Fecha de inicio</label>
              <p class="font-semibold text-neutral-800" hlmDrawerDescription>
                {{ detallesConvocatoria()?.fechaInicio | date: 'dd/MM/yyyy' }}
              </p>
            </hlm-field>
            <hlm-field class="w-full">
              <label hlmFieldLabel>Fecha de finalización</label>
              <p class="font-semibold text-neutral-800" hlmDrawerDescription>
                {{ detallesConvocatoria()?.fechaFin | date: 'dd/MM/yyyy' }}
              </p>
            </hlm-field>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <hlm-field class="w-full">
              <label hlmFieldLabel for="cicloEscolar">Ciclo escolar</label>

              <p class="font-semibold text-neutral-800" hlmDrawerDescription>
                {{ detallesConvocatoria()?.cicloEscolar }}
              </p>
            </hlm-field>
            <hlm-field class="w-full">
              <label hlmFieldLabel for="cupoMaximo">Cupo máximo</label>

              <p class="font-semibold text-neutral-800" hlmDrawerDescription>
                {{ detallesConvocatoria()?.cupoMaximo }}
              </p>
            </hlm-field>
          </div>
        </hlm-field-group>
        <!-- Botones -->
        <hlm-drawer-footer>
          <div class="grid grid-cols-2 gap-3">
            <button hlmDrawerClose hlmBtn variant="outline">
              <ng-icon name="lucideArrowLeft" />Salir
            </button>
            <button hlmBtn type="submit">
              <ng-icon name="lucidePencil" />
              Editar convocatoria
            </button>
          </div>
        </hlm-drawer-footer>
      </hlm-drawer-content>
    </hlm-drawer>
  `,
})
export class AbrirConvocatorias {
  detallesConvocatoria = input<Convocatoria | null>(null);
  abierto = input(false);
  cerrado = output<void>();

  /**Fecha minima */
  public minDate = new Date(2023, 0, 1);

  /** Fecha maxima */
  public maxDate = new Date(2030, 11, 31);
}
