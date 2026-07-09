import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { lucidePlus, lucideArrowLeft } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';

@Component({
  selector: 'crear-convocatorias',
  standalone: true,
  imports: [
    HlmButtonImports,
    HlmDrawerImports,
    HlmFieldImports,
    HlmInputImports,
    NgIcon,
    HlmTextareaImports,
    HlmDatePickerImports,
  ],
  providers: [
    provideHlmDatePickerConfig({ autoCloseOnSelect: true }),
    provideIcons({
      lucidePlus,
      lucideArrowLeft,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-drawer>
      <button
        id="crear-convocatorias-button"
        hlmDrawerTrigger
        direction="right"
        hlmBtn
        variant="outline"
        class="ml-auto rounded-full border-lime-600 bg-lime-50 text-lime-600 hover:bg-lime-100 hover:text-lime-600"
      >
        <ng-icon name="lucidePlus" />
        Crear convocatoria
      </button>
      <!-- Modal -->
      <hlm-drawer-content *hlmDrawerPortal="let ctx" class="w-full max-w-4xl">
        <hlm-drawer-header>
          <h1 hlmDrawerTitle>Crear Convocatoria</h1>
          <p hlmDrawerDescription>
            Cree una nueva convocatoria aquí. Haga clic en guardar cuando haya terminado.
          </p>
        </hlm-drawer-header>

        <!-- Inputs -->
        <hlm-field-group class="px-4 pt-4 ">
          <hlm-field>
            <label hlmFieldLabel for="title">Titulo de la convocatoria</label>
            <input hlmInput id="title" placeholder="Escribe el titulo de la convocatoria." />
          </hlm-field>
          <hlm-field>
            <label hlmFieldLabel for="description">Descripción de la convocatoria</label>
            <textarea
              hlmTextarea
              id="description"
              placeholder="Escribe la descripcion que se mostrara para dar mas detalles de la convocatoria."
              class="h-24"
            ></textarea>
          </hlm-field>
          <!-- Fechas -->
          <div class="grid grid-cols-2 gap-3">
            <hlm-field class="w-full">
              <label hlmFieldLabel>Fecha de inicio</label>
              <hlm-date-picker [min]="minDate" [max]="maxDate">
                <hlm-date-picker-trigger buttonId="fechaInicio" class="w-full"
                  >Elije una fecha</hlm-date-picker-trigger
                >
              </hlm-date-picker>
            </hlm-field>
            <hlm-field class="w-full">
              <label hlmFieldLabel>Fecha de finalización</label>
              <hlm-date-picker [min]="minDate" [max]="maxDate">
                <hlm-date-picker-trigger buttonId="fechaFinalizacion" class="w-full"
                  >Elije una fecha</hlm-date-picker-trigger
                >
              </hlm-date-picker>
            </hlm-field>
          </div>

          <!-- inputs -->
          <div class="grid grid-cols-2 gap-3">
            <hlm-field class="w-full">
              <label hlmFieldLabel for="cicloEscolar">Ciclo escolar</label>
              <input hlmInput id="cicloEscolar" placeholder="Escribe el ciclo escolar" />
            </hlm-field>
            <hlm-field class="w-full">
              <label hlmFieldLabel for="cupoMaximo">Cupo</label>
              <input hlmInput id="cupoMaximo" placeholder="Escribe el cupo " />
            </hlm-field>
          </div>
        </hlm-field-group>
        <!-- Botones -->
        <hlm-drawer-footer>
          <div class="grid grid-cols-2 gap-3">
            <button hlmDrawerClose hlmBtn variant="outline">
              <ng-icon name="lucideArrowLeft" />
              Salir
            </button>
            <button hlmBtn type="submit"><ng-icon name="lucidePlus" />Crear convocatoria</button>
          </div>
        </hlm-drawer-footer>
      </hlm-drawer-content>
    </hlm-drawer>
  `,
})
export class CrearConvocatorias {
  /**Fecha minima */
  public minDate = new Date(2023, 0, 1);

  /** Fecha maxima */
  public maxDate = new Date(2030, 11, 31);
}
