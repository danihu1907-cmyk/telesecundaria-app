import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import {
  HlmFieldGroup,
  HlmField,
  HlmFieldError,
  HlmFieldSeparator,
} from '../../../../libs/ui/field/src';

@Component({
  selector: 'login-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HlmInputImports,
    HlmButtonImports,
    HlmFieldGroup,
    HlmField,
    HlmFieldError,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="login()">
      <hlm-field-group>
        <div class="flex flex-col gap-2 text-left">
          <h1 class="text-3xl font-bold">Inicia sesión en tu cuenta</h1>
          <p class="text-muted-foreground text-lg ">
            Ingresa tu usuario y contraseña para acceder a tu cuenta.
          </p>
        </div>
        <hlm-field>
          <label hlmFieldLabel for="user">Usuario</label>
          <input hlmInput type="text" id="user" placeholder="usuario" formControlName="user" />
          <hlm-field-error validator="required">Se requiere un usuario.</hlm-field-error>
          <hlm-field-error validator="minlength"
            >El usuario debe tener al menos 5 caracteres.</hlm-field-error
          >
        </hlm-field>
        <hlm-field>
          <div class="flex items-center">
            <label hlmFieldLabel for="password">Contraseña</label>
            <a
              hlmFieldDescription
              class="ml-auto text-sm underline-offset-4 hover:underline"
              routerLink="."
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <input hlmInput type="password" id="password" formControlName="password" />
          <hlm-field-error validator="required">Se requiere una contraseña.</hlm-field-error>
          <hlm-field-error validator="minlength"
            >La contraseña debe tener al menos 8 caracteres.</hlm-field-error
          >
        </hlm-field>
        <hlm-field>
          <button routerLink="/dashboard" hlmBtn type="submit" [disabled]="form.invalid">
            Iniciar sesión
          </button>
        </hlm-field>
        <!-- <hlm-field-separator>Or continue with</hlm-field-separator>
        <hlm-field>
          <button hlmBtn variant="outline" type="button">
            <ng-icon name="remixGithubFill" class="text-xl" />
            Login with GitHub
          </button>
          <p hlmFieldDescription class="text-center">
            Don't have an account?
            <a routerLink=".">Sign up</a>
          </p>
        </hlm-field> -->
      </hlm-field-group>
    </form>
  `,
})
export class LoginForm {
  private readonly _fb = inject(FormBuilder);

  public form = this._fb.group({
    user: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  public login() {
    if (this.form.valid) {
      // login logic here
      console.log(this.form.value);
    }
  }
}
