import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { lucidePlus, lucideArrowLeft } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmSliderImports } from '@spartan-ng/helm/slider';
import { HlmSwitch } from '@spartan-ng/helm/switch';
import { ListaGaleria } from '../../../pages/galeria/lista-galeria';
import { toast } from '@spartan-ng/brain/sonner';
import { GaleriaService } from '../../../services/galeria.service';
import { CreateConvocatoriaRequest } from '../../../models/convocatorias.models';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
  submit,
} from '@angular/forms/signals';

@Component({
  selector: 'crear-convocatorias',

  imports: [
    HlmButtonImports,
    HlmDrawerImports,
    HlmFieldImports,
    HlmInputImports,
    NgIcon,
    HlmTextareaImports,
    HlmDatePickerImports,
    HlmSheetImports,
    HlmSliderImports,
    HlmSwitch,
    ListaGaleria,
    FormRoot,
    FormField,
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
    <hlm-sheet>
      <button
        id="crear-convocatorias-button"
        hlmSheetTrigger
        side="right"
        hlmBtn
        variant="outline"
        class="ml-auto rounded-full border-lime-600 bg-lime-50 text-lime-600 hover:bg-lime-100 hover:text-lime-600"
      >
        <ng-icon name="lucidePlus" />
        Crear convocatoria
      </button>
      <!-- Modal -->
      <hlm-sheet-content *hlmSheetPortal="let ctx" class="flex flex-col h-full">
        <hlm-sheet-header>
          <h1 hlmSheetTitle>Crear Convocatoria</h1>
          <p hlmSheetDescription>Cree una nueva convocatoria aquí.</p>
        </hlm-sheet-header>

        <!-- Inputs -->
        <form
          novalidate
          FormRoot="formulario"
          id="form-crear-convocatorias"
          class=" flex-1 overflow-y-auto "
          (submit)="submit($event)"
        >
          <hlm-field-group class="px-4 flex-1 overflow-y-auto ">
            <hlm-field>
              <label hlmFieldLabel for="titulo">Titulo de la convocatoria</label>
              <input
                hlmInput
                id="titulo"
                FormField="formulario.titulo"
                placeholder="Escribe el titulo de la convocatoria."
              />
              @for (error of formulario.titulo().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="subtitulo">Subtitulo de la convocatoria</label>
              <input
                hlmInput
                id="subtitulo"
                FormField="formulario.subtitulo"
                placeholder="Escribe el subtitulo de la convocatoria."
              />
              @for (error of formulario.subtitulo().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="descripcion">Descripción de la convocatoria</label>
              <textarea
                hlmTextarea
                id="descripcion"
                placeholder="Escribe la descripcion que se mostrara para dar mas detalles de la convocatoria."
                class="h-24"
                FormField="formulario.descripcion"
              ></textarea>
              @for (error of formulario.descripcion().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
            <!-- Fechas -->
            <div class="grid grid-cols-2 gap-3">
              <hlm-field class="w-full">
                <label hlmFieldLabel>Fecha de inicio</label>
                <hlm-date-picker [min]="minDate" [max]="maxDate" FormField="formulario.fechaInicio">
                  <hlm-date-picker-trigger buttonId="fechaInicio" class="w-full"
                    >Elije una fecha</hlm-date-picker-trigger
                  >
                </hlm-date-picker>
                @for (error of formulario.fechaInicio().errors(); track error) {
                  <hlm-field-error [validator]="error.kind">
                    {{ error.message }}
                  </hlm-field-error>
                }
              </hlm-field>
              <hlm-field class="w-full">
                <label hlmFieldLabel>Fecha de finalización</label>
                <hlm-date-picker [min]="minDate" [max]="maxDate" FormField="formulario.fechaFin">
                  <hlm-date-picker-trigger buttonId="fechaFin" class="w-full"
                    >Elije una fecha</hlm-date-picker-trigger
                  >
                </hlm-date-picker>
                @for (error of formulario.fechaFin().errors(); track error) {
                  <hlm-field-error [validator]="error.kind">
                    {{ error.message }}
                  </hlm-field-error>
                }
              </hlm-field>
            </div>

            <!-- inputs -->
            <div class="grid grid-cols-2 gap-3">
              <hlm-field class="w-full">
                <label hlmFieldLabel for="cicloEscolar">Ciclo escolar</label>
                <input
                  hlmInput
                  id="cicloEscolar"
                  placeholder="Escribe el ciclo escolar"
                  FormField="formulario.cicloEscolar"
                />
                @for (error of formulario.cicloEscolar().errors(); track error) {
                  <hlm-field-error [validator]="error.kind">
                    {{ error.message }}
                  </hlm-field-error>
                }
              </hlm-field>

              <hlm-field class="w-full">
                <label hlmFieldLabel for="cupoMaximo">Cupo Maximo: {{ value() }}</label>
                <hlm-slider
                  id="cupoMaximo"
                  class="w-full"
                  [max]="1000"
                  [min]="50"
                  [step]="50"
                  FormField="formulario.cupoMaximo"
                />
              </hlm-field>
            </div>

            <!-- Seleccionar imagen -->

            <hlm-field class="w-full">
              <label hlmFieldLabel for="cicloEscolar">Elegir imagen de banner</label>
              <lista-galeria FormField="formulario.claveImagen"></lista-galeria>
              @for (error of formulario.claveImagen().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
          </hlm-field-group>
          <!-- Botones -->
          <hlm-sheet-footer>
            <div class="grid grid-cols-2 gap-3 w-full">
              <button hlmSheetClose hlmBtn variant="outline">
                <ng-icon name="lucideArrowLeft" />
                Salir
              </button>
              <button hlmBtn type="submit" form="form-crear-convocatorias">
                <ng-icon name="lucidePlus" />Crear convocatoria
              </button>
            </div>
          </hlm-sheet-footer>
        </form>
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class CrearConvocatorias {
  /** Valor del slider */
  public readonly value = signal([1000]);
  /**Fecha minima */
  public minDate = new Date(2023, 0, 1);

  /** Fecha maxima */
  public maxDate = new Date(2030, 11, 31);

  /** Modelo de la convocatoria */
  convocatoriaModel = signal<CreateConvocatoriaRequest>({
    titulo: '',
    subtitulo: '',
    descripcion: '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    cicloEscolar: '',
    cupoMaximo: 1000,
    claveImagen: '',
    nombreUsuario: 'admin',
  });

  public readonly formulario = form(
    this.convocatoriaModel,
    (schemaPath) => {
      required(schemaPath.titulo, { message: 'Title must be entered.' });
      minLength(schemaPath.titulo, 5, { message: 'Title must be at least 5 characters.' });
      maxLength(schemaPath.titulo, 32, { message: 'Title cannot exceed 32 characters.' });

      required(schemaPath.descripcion, { message: 'Description must be entered.' });
      minLength(schemaPath.descripcion, 20, {
        message: 'Description must be at least 20 characters.',
      });
      maxLength(schemaPath.descripcion, 100, {
        message: 'Description must be at most 100 characters',
      });
    },
    // {
    //   // triggers the submission flow by calling `submit()` - marks all fields as touched, revealing validation errors
    //   submission: {
    //     action: async () => {
    //       const model = this.convocatoriaModel();

    //       console.log('You submitted the following values:', JSON.stringify(model, null, 2));

    //       // submit to api
    //     },
    //   },
    // },
  );

  async submit(event: Event) {
    event.preventDefault();

    // marks all fields as touched, revealing validation errors
    submit(this.formulario, async () => {
      const model = this.convocatoriaModel();

      console.log('You submitted the following values:', JSON.stringify(model, null, 2));
    });
  }
}
