import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBuilding } from '@ng-icons/lucide';
import { LoginForm } from './login-form';

@Component({
  selector: 'reactive-form',
  imports: [RouterLink, LoginForm, NgIcon],
  providers: [provideIcons({ lucideBuilding })],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <div class="grid min-h-svh lg:grid-cols-2">
      <div class="flex flex-col gap-4 p-6 md:p-10">
        <div class="flex justify-center gap-2 md:justify-start">
          <a routerLink="" class="flex items-center gap-2 font-medium">
            <div
              class="bg-sidebar-primary text-primary-foreground flex size-8 items-center justify-center rounded-md"
            >
              <ng-icon name="lucideBuilding" class="text-base" />
            </div>
            TS Silvestre Aguilar Vargas
          </a>
        </div>
        <div class="flex flex-1 items-center justify-center">
          <div class="w-full max-w-xs">
            <login-form />
          </div>
        </div>
      </div>
      <div class="bg-muted relative hidden lg:block">
        <img
          src="images/conocenos.jpg"
          alt="Image"
          class="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
    </div>
  `,
})
export class LoginDashboard {}
