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
import {
  lucideEdit,
  lucideArrowLeft,
  lucideLoader,
  lucideCheckCircle,
  lucideSave,
} from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmSliderImports } from '@spartan-ng/helm/slider';
import { ListaGaleria } from '../../../pages/galeria/lista-galeria';
import { toast } from '@spartan-ng/brain/sonner';
import { Convocatoria, UpdateConvocatoriaRequest } from '../../../models/convocatorias.models';
import {
  form,
  FormField,
  FormRoot,
  max,
  maxLength,
  min,
  minLength,
  required,
} from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { ConvocatoriasService } from '../../../services/convocatorias.service';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';
import { BrnDialogState } from '@spartan-ng/brain/dialog';

@Component({
  selector: 'editar-convocatorias',

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
    FormRoot,
    FormField,
    ListaGaleria,
    CommonModule,
  ],
  providers: [
    provideHlmDatePickerConfig({
      autoCloseOnSelect: true,
      formatDate: (date: Date) => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy'),
    }),
    provideIcons({
      lucideEdit,
      lucideArrowLeft,
      lucideCheckCircle,
      lucideLoader,
      lucideSave,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editar-convocatoria.html',
})
export class EditarConvocatorias {
  private convocatoriasService = inject(ConvocatoriasService);

  readonly convocatoria = input<Convocatoria | null>(null);

  public readonly imagenSeleccionada = signal<string | null>(null);
  public readonly submitting = signal(false);

  public readonly modoEdicion = signal(false);

  readonly abierto = input<boolean>(false);
  readonly actualizado = output<void>();

  /** Modelo de la convocatoria */
  DEFAULT_EDITAR = {
    claveConvocatoria: '',
    titulo: '',
    subtitulo: '',
    descripcion: '',
    cupoMaximo: 0,
    claveImagen: '',
    nombreUsuario: 'admin',
    destacadoTexto: '',
  } as const;

  updateModel = signal<UpdateConvocatoriaRequest>(this.DEFAULT_EDITAR);

  private loadEffect = effect(() => {
    const convocatoria = this.convocatoria();

    if (convocatoria) {
      console.log('✅ Cargando datos de la convocatoria:', convocatoria);
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
    }
  });

  public readonly formulario = form(
    this.updateModel,
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

      required(schemaPath.cupoMaximo, { message: 'Debes ingresar un cupo máximo.' });
      min(schemaPath.cupoMaximo, 1, { message: 'El cupo máximo debe ser al menos 1.' });
      max(schemaPath.cupoMaximo, 1000, { message: 'El cupo máximo no puede exceder 1000.' });
      required(schemaPath.claveImagen, { message: 'Debes seleccionar una imagen.' });
    },
    {
      // triggers the submission flow by calling `submit()` - marks all fields as touched, revealing validation errors
      submission: {
        action: async () => {
          const model = this.updateModel();
          await this.onSubmit();
        },
      },
    },
  );

  async onSubmit(): Promise<void> {
    console.log('Formulario enviado');
    const model = this.updateModel();

    // Verificar que la claveConvocatoria no esté vacía
    if (!model.claveConvocatoria) {
      toast.error('Error', {
        description: 'No se encontró la clave de la convocatoria.',
      });
      return;
    }

    this.submitting.set(true);

    try {
      //Llamar al servicio para actualizar
      const response = await firstValueFrom(
        this.convocatoriasService.actualizarConvocatoria(model.claveConvocatoria, model),
      );

      // Manejar respuesta exitosa
      if (response) {
        toast.success('¡Convocatoria editada!', {
          description: `La convocatoria "${response.titulo}" se ha editado exitosamente.`,
          duration: 5000,
        });

        this.submitting.set(false);
        this.cerrarDrawer();
        this.actualizado.emit();

        // Recargar la tabla de convocatorias
        this.convocatoriasService.obtenerConvocatorias().subscribe();
      } else {
        toast.error('Error al editar convocatoria', {
          description: 'La respuesta del servidor fue vacía o inválida.',
          duration: 5000,
        });
        this.submitting.set(false);
      }
    } catch (error: any) {
      //  Manejar error
      console.error('Error al editar convocatoria:', error);
      toast.error('Error al editar convocatoria', {
        description:
          error?.message || 'Ocurrió un error inesperado. Por favor, intente nuevamente.',
        duration: 6000,
      });
      this.submitting.set(false);
    }
  }

  seleccionarImagen(claveImagen: string): void {
    this.imagenSeleccionada.set(claveImagen);
    this.updateModel.update((model) => ({
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
    this.updateModel.set(this.DEFAULT_EDITAR);
    this.imagenSeleccionada.set(null);
    this.submitting.set(false);
  }
}
