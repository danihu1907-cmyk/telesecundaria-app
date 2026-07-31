import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
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
import {
  Convocatoria,
  CreateConvocatoriaRequest,
  UpdateConvocatoriaRequest,
} from '../../../models/convocatorias.models';
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
  templateUrl: './crear-convocatoria.html',
})
export class CrearConvocatorias {
  /** Valor del slider */
  public readonly value = signal([0]);

  private convocatoriasService = inject(ConvocatoriasService);

  // modo edicion
  readonly convocatoriaParaEditar = input<UpdateConvocatoriaRequest | null>(null);
  readonly abierto = input<boolean>(false);

  //outputs
  readonly cerrado = output<void>();
  readonly actualizado = output<void>();

  //estados
  public readonly imagenSeleccionada = signal<string | null>(null);
  public readonly submitting = signal(false);
  public readonly modoEdicion = signal(false);

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
    destacadoTexto: '',
  } as const;

  private updateModel = signal<UpdateConvocatoriaRequest>({
    claveConvocatoria: '',
    titulo: '',
    subtitulo: '',
    descripcion: '',
    cupoMaximo: 0,
    nombreUsuario: 'admin',
    claveImagen: '',
    destacadoTexto: '',
  });

  convocatoriaModel = signal<CreateConvocatoriaRequest>(this.DEFAULT_CONVOCATORIA);

  //efecto cargar datos
  private loadEffect = effect(() => {
    const convocatoria = this.convocatoriaParaEditar();
    const abierto = this.abierto();

    if (convocatoria && abierto) {
      this.modoEdicion.set(true);
      this.updateModel.set({
        claveConvocatoria: convocatoria.claveConvocatoria,
        titulo: convocatoria.titulo || '',
        subtitulo: convocatoria.subtitulo || '',
        descripcion: convocatoria.descripcion || '',
        cupoMaximo: convocatoria.cupoMaximo || 0,
        nombreUsuario: 'admin',
        claveImagen: convocatoria.claveImagen || '',
        destacadoTexto: convocatoria.destacadoTexto || '',
      });
      this.updateModel.set({
        claveConvocatoria: convocatoria.claveConvocatoria,
        titulo: convocatoria.titulo || '',
        subtitulo: convocatoria.subtitulo || '',
        descripcion: convocatoria.descripcion || '',
        cupoMaximo: convocatoria.cupoMaximo || 0,
        nombreUsuario: 'admin',
        claveImagen: convocatoria.claveImagen || '',
        destacadoTexto: convocatoria.destacadoTexto || '',
      });
      this.imagenSeleccionada.set(convocatoria.claveImagen || null);
    } else if (abierto) {
      this.modoEdicion.set(false);
      this.convocatoriaModel.set({ ...this.DEFAULT_CONVOCATORIA });
      this.imagenSeleccionada.set(null);
    }
  });

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

          const toastId = toast.loading(
            this.modoEdicion() ? 'Actualizando convocatoria...' : 'Creando convocatoria...',
            {
              description: this.modoEdicion()
                ? 'Por favor, espere mientras se actualiza la solicitud.'
                : 'Por favor, espere mientras se procesa la solicitud.',
            },
          );

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
