import {
  Component,
  output,
  inject,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// EXPRESSION REGULAR OFICIAL PARA VALIDAR LA ESTRUCTURA DE LA CURP EN MÉXICO
const CURP_REGEXP = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/i;

@Component({
  selector: 'app-info-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './info-form.component.html',
  styleUrl: './info-form.component.css',
})
export class InfoFormComponent implements OnInit, OnChanges {
  siguiente = output<any>();
  @Input() datosIniciales: any = null;

  // RECIBE EL ERROR DE CURP QUE VIENE DEL SERVIDOR PARA MOSTRARLO DEBAJO DEL CAMPO
  @Input() errorCurpServidor: string | null = null;

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  // BANDERA PARA SABER SI EL USUARIO YA DIO CLIC EN EL BOTÓN DE SEGUIR
  enviado = false;

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellidoPaterno: ['', Validators.required],
    apellidoMaterno: ['', Validators.required],
    // MODIFICADO: SE AÑADE VALIDATORS.PATTERN PARA MANEJAR ESTRUCTURA OFICIAL DESDE EL FRONT-END
    curp: [
      '',
      [
        Validators.required,
        Validators.minLength(18),
        Validators.maxLength(18),
        Validators.pattern(CURP_REGEXP),
      ],
    ],
    escuelaProcedencia: ['', Validators.required],
    promedioPrimaria: [
      null as number | null,
      [Validators.required, Validators.min(0), Validators.max(10)],
    ],
    discapacidadTexto: ['No', Validators.required],
    nombreEnfermedad: [''],
    hermanoTexto: ['No', Validators.required],
    curpHermano: [''],
  });

  // NUEVO METODO DE CICLO DE VIDA: DETECTA CUANDO LOS DATOSINICIALES LLEGAN ASINCRONAMENTE DESDE EL SERVIDOR Y RELLENA LOS INPUTS EN TIEMPO REAL
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosIniciales'] && changes['datosIniciales'].currentValue) {
      this.form.patchValue(changes['datosIniciales'].currentValue);
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    if (this.datosIniciales) {
      this.form.patchValue(this.datosIniciales);
    }

    // Escucha dinámica para Enfermedad
    this.form.get('discapacidadTexto')?.valueChanges.subscribe((valor) => {
      const campoEnfermedad = this.form.get('nombreEnfermedad');
      if (valor === 'Sí') {
        campoEnfermedad?.setValidators([Validators.required]);
        // RESETEA enviado PARA DAR OPORTUNIDAD AL USUARIO DE ESCRIBIR SIN VER ERRORES
        this.enviado = false;
      } else {
        campoEnfermedad?.clearValidators();
        campoEnfermedad?.setValue('');
      }
      campoEnfermedad?.updateValueAndValidity({ emitEvent: false });
      this.cdr.detectChanges();
    });

    // Escucha dinámica para Hermano
    this.form.get('hermanoTexto')?.valueChanges.subscribe((valor) => {
      const campoCurpHermano = this.form.get('curpHermano');
      if (valor === 'Sí') {
        // MODIFICADO: SE AGREGA EL VALIDATOR PATTERN TAMBIÉN PARA LA CURP DEL HERMANO
        campoCurpHermano?.setValidators([
          Validators.required,
          Validators.minLength(18),
          Validators.maxLength(18),
          Validators.pattern(CURP_REGEXP),
        ]);
        // RESETEA enviado PARA DAR OPORTUNIDAD AL USUARIO DE ESCRIBIR SIN VER ERRORES
        this.enviado = false;
      } else {
        campoCurpHermano?.clearValidators();
        campoCurpHermano?.setValue('');
      }
      campoCurpHermano?.updateValueAndValidity({ emitEvent: false });
      this.cdr.detectChanges();
    });

    // NUEVO BLOQUE: LIMPIA EL ERROR DEL SERVIDOR INMEDIATAMENTE CUANDO EL USUARIO CORRIGE O ESCRIBE
    this.form.get('curp')?.valueChanges.subscribe(() => {
      this.errorCurpServidor = null;
    });
  }

  get tieneCondicion(): boolean {
    return this.form.get('discapacidadTexto')?.value === 'Sí';
  }

  get tieneHermano(): boolean {
    return this.form.get('hermanoTexto')?.value === 'Sí';
  }

  // Comprueba si el campo es inválido SÓLO si ha sido tocado o si se envió el formulario
  isInvalid(campo: string): boolean {
    const c = this.form.get(campo);
    if (!c) return false;

    // CORRECCION PARA CAMPOS CONDICIONALES — SOLO SE VALIDA SI EL USUARIO YA INTENTO AVANZAR
    // NUNCA SE MUESTRA ERROR EN EL MOMENTO QUE APARECE EL CAMPO, SIN IMPORTAR touched O dirty
    if (campo === 'nombreEnfermedad' || campo === 'curpHermano') {
      return !!(c.invalid && this.enviado);
    }

    // Regla normal para el resto de los campos estáticos
    return !!(c.invalid && (c.touched || c.dirty || this.enviado));
  }

  // Control estricto de mensajes para la CURP (Aspirante y Hermano)
  getErroresCurp(campoNombre: string): string {
    const control = this.form.get(campoNombre);
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (control.errors['minlength'] || control.errors['maxlength']) {
        return 'La CURP debe tener 18 caracteres';
      }
      // NUEVO BLOQUE: SE CORRIGE MENSAJE CUANDO LA REGEX INTERNA SE ACTIVA
      if (control.errors['pattern']) {
        return 'El formato de la CURP es incorrecto (Estructura oficial)';
      }
    }
    return '';
  }

  onSubmit(): void {
    this.enviado = true;

    if (this.form.invalid) {
      // Marcamos todo como tocado para activar los mensajes visuales de error de los campos visibles
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    // Si es válido, emite los datos inmediatamente al padre
    this.siguiente.emit(this.form.value);
  }
}
