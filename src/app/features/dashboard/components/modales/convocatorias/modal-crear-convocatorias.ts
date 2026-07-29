import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { lucidePlus, lucideArrowLeft, lucideLoader, lucideCheckCircle } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmSliderImports } from '@spartan-ng/helm/slider';
import { ListaGaleria } from '../../../pages/galeria/lista-galeria';
import { toast } from '@spartan-ng/brain/sonner';
import { CreateConvocatoriaRequest } from '../../../models/convocatorias.models';
import {
  form,
  FormField,
  FormRoot,
  max,
  maxLength,
  min,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { ConvocatoriasService } from '../../../services/convocatorias.service';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';
import { BrnDialogState } from '@spartan-ng/brain/dialog';

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
    ListaGaleria,
    FormRoot,
    FormField,
    CommonModule,
  ],
  providers: [
    provideHlmDatePickerConfig({
      autoCloseOnSelect: true,
      formatDate: (date: Date) => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy'),
    }),
    provideIcons({
      lucidePlus,
      lucideArrowLeft,
      lucideCheckCircle,
      lucideLoader,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <hlm-sheet (stateChanged)="onSheetStateChanged($event)">
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
          [formRoot]="formulario"
          id="form-crear-convocatorias"
          class=" flex-1 overflow-y-auto "
        >
          <hlm-field-group class="px-4 flex-1 overflow-y-auto ">
            <hlm-field>
              <label hlmFieldLabel for="titulo">Titulo de la convocatoria</label>
              <input
                hlmInput
                id="titulo"
                [formField]="formulario.titulo"
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
                [formField]="formulario.subtitulo"
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
                [formField]="formulario.descripcion"
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
                <hlm-date-picker [formField]="formulario.fechaInicio">
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
                <hlm-date-picker [formField]="formulario.fechaFin">
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
                  [formField]="formulario.cicloEscolar"
                />
                @for (error of formulario.cicloEscolar().errors(); track error) {
                  <hlm-field-error [validator]="error.kind">
                    {{ error.message }}
                  </hlm-field-error>
                }
              </hlm-field>

              <hlm-field class="w-full">
                <label hlmFieldLabel for="cupoMaximo">Cupo Maximo:</label>
                <input
                  hlmInput
                  id="cupoMaximo"
                  type="number"
                  placeholder="Escribe el cupo maximo"
                  [formField]="formulario.cupoMaximo"
                />
              </hlm-field>
            </div>

            <!-- Seleccionar imagen -->

            <hlm-field class="w-full">
              <label hlmFieldLabel for="cicloEscolar"
                >Elegir imagen de banner
                @if (imagenSeleccionada()) {
                  <p class="text-sm text-green-600 ml-2">
                    <ng-icon name="lucideCheckCircle" class="h-4 w-4" />
                    Imagen seleccionada
                  </p>
                }
              </label>

              <lista-galeria (imagenSeleccionada)="seleccionarImagen($event)" />

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
              <button hlmSheetClose hlmBtn variant="outline" type="button">
                <ng-icon name="lucideArrowLeft" />
                Salir
              </button>
              <button
                hlmBtn
                type="submit"
                form="form-crear-convocatorias"
                [disabled]="submitting()"
              >
                @if (submitting()) {
                  <ng-icon name="lucideLoader" class="h-4 w-4 animate-spin mr-2" />
                  Creando...
                } @else {
                  <ng-icon name="lucidePlus" />
                  Crear convocatoria
                }
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
  public readonly value = signal([0]);

  private convocatoriasService = inject(ConvocatoriasService);

  public readonly imagenSeleccionada = signal<string | null>(null);
  public readonly submitting = signal(false);

  /** Modelo de la convocatoria */
  DEFAULT_CONVOCATORIA = {
    titulo: '',
    subtitulo: '',
    descripcion: '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
    cicloEscolar: '',
    cupoMaximo: 0,
    claveImagen: '',
    nombreUsuario: 'admin',
  } as const;

  convocatoriaModel = signal<CreateConvocatoriaRequest>(this.DEFAULT_CONVOCATORIA);

  public readonly formulario = form(
    this.convocatoriaModel,
    (schemaPath) => {
      required(schemaPath.titulo, { message: 'Debes ingresar un título.' });
      minLength(schemaPath.titulo, 5, { message: 'El título debe tener al menos 5 caracteres.' });

      required(schemaPath.subtitulo, { message: 'Debes ingresar un subtitulo.' });
      minLength(schemaPath.subtitulo, 5, {
        message: 'El subtitulo debe tener al menos 5 caracteres.',
      });

      required(schemaPath.descripcion, { message: 'Debes ingresar una descripción.' });
      minLength(schemaPath.descripcion, 10, {
        message: 'La descripción debe tener al menos 10 caracteres.',
      });
      maxLength(schemaPath.descripcion, 50, {
        message: 'La descripción no puede exceder 50 caracteres.',
      });

      required(schemaPath.fechaInicio, { message: 'Debes ingresar una fecha de inicio.' });
      validate(schemaPath.fechaInicio, ({ state }) => {
        if (!state.touched()) {
          return { kind: 'required', message: 'Debes seleccionar una fecha de inicio.' };
        }
        return null;
      });
      required(schemaPath.fechaFin, { message: 'Debes ingresar una fecha de finalización.' });
      validate(schemaPath.fechaFin, ({ state }) => {
        if (!state.touched()) {
          return { kind: 'required', message: 'Debes seleccionar una fecha de finalización.' };
        }
        return null;
      });

      required(schemaPath.cicloEscolar, { message: 'Debes ingresar un ciclo escolar.' });
      required(schemaPath.claveImagen, { message: 'Debes seleccionar una imagen.' });
      required(schemaPath.cupoMaximo, { message: 'Debes ingresar un cupo máximo.' });
      min(schemaPath.cupoMaximo, 1, { message: 'El cupo máximo debe ser al menos 1.' });
      max(schemaPath.cupoMaximo, 1000, { message: 'El cupo máximo no puede exceder 1000.' });
    },
    {
      // triggers the submission flow by calling `submit()` - marks all fields as touched, revealing validation errors
      submission: {
        action: async () => {
          const model = this.convocatoriaModel();
          this.submitting.set(true);

          const toastId = toast.loading('Creando convocatoria...', {
            description: 'Por favor, espere mientras se procesa la solicitud.',
          });

          try {
            //Llamar al servicio para crear la convocatoria
            const response = await firstValueFrom(
              this.convocatoriasService.crearConvocatoria(model),
            );

            // Manejar respuesta exitosa
            if (response) {
              toast.success('¡Convocatoria creada!', {
                description: `La convocatoria "${response.titulo}" se ha creado exitosamente.`,
                duration: 5000,
              });

              this.submitting.set(false);
              this.cerrarDrawer();

              // Recargar la tabla de convocatorias
              this.convocatoriasService.obtenerConvocatorias().subscribe();
            } else {
              toast.error('Error al crear convocatoria', {
                description: 'La respuesta del servidor fue vacía o inválida.',
                duration: 5000,
              });
              this.submitting.set(false);
            }
          } catch (error: any) {
            //  Manejar error
            console.error('Error al crear convocatoria:', error);
            toast.error('Error al crear convocatoria', {
              description:
                error?.message || 'Ocurrió un error inesperado. Por favor, intente nuevamente.',
              duration: 6000,
            });
            this.submitting.set(false);
          }
        },
      },
    },
  );

  seleccionarImagen(claveImagen: string): void {
    this.imagenSeleccionada.set(claveImagen);
    this.convocatoriaModel.update((model) => ({
      ...model,
      claveImagen: claveImagen,
    }));

    toast.success('Imagen seleccionada', {
      description: 'La imagen se ha seleccionado correctamente.',
      duration: 3000,
    });
  }

  /** Cerrar el drawer */
  cerrarDrawer(): void {
    const closeButton = document.querySelector('[hlmSheetClose]') as HTMLElement;
    if (closeButton) {
      closeButton.click();
    }
    this.resetForm();
  }

  onSheetStateChanged(state: BrnDialogState): void {
    if (state === 'closed') {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.convocatoriaModel.set(this.DEFAULT_CONVOCATORIA);
    this.imagenSeleccionada.set(null);
    this.submitting.set(false);
  }
}
