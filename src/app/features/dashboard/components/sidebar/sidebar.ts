import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { Router, RouterOutlet } from '@angular/router';

import {
  lucideHome,
  lucideFileText,
  lucideUsers,
  lucideUserCircle,
  lucideBookOpen,
  lucideCalendar,
  lucideClipboardList,
  lucideSettings,
  lucideLogOut,
  lucideInbox,
  lucideSearch
} from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [HlmSidebarImports, HlmAvatarImports, NgIcon, HlmIcon, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-72 bg-neutral-100 rounded-lg  outline-1 outline-offset-1">
      <!-- Header con logo y nombre de escuela -->
      <div class="p-2">
        <div class="h-14 p-2 flex items-center gap-2">
          <div class="size-8 bg-lime-600 rounded-lg flex items-center justify-center">
            <div class="size-4 relative">
              <div
                class="w-2.5 h-3.5 absolute left-[2.67px] top-[1.33px] outline-1 outline-offset-[-0.5px] outline-neutral-50"
              ></div>
            </div>
          </div>
          <div class="flex-1">
            <div class="text-zinc-700 text-sm font-semibold leading-5">
              TS Silvestre Aguilar Vargas
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal del sidebar -->
      <div class="px-4 pt-2 pb-6 flex flex-col gap-4">
        <!-- Sección: Escuela -->
        <div>
          <div class="h-11 px-2 flex items-center gap-2.5">
            <div class="opacity-70 text-neutral-950 text-xs font-normal leading-4">Escuela</div>
          </div>
          <div class="flex flex-col gap-2">
            <button
              (click)="navegar('/dashboard/inicio')"
              class="w-full h-11 px-4 py-2 rounded-[200px] flex items-center gap-2 hover:bg-lime-50 transition-colors"
              [class.bg-lime-600]="activeRoute === '/dashboard/inicio'"
              [class.text-white]="activeRoute === '/dashboard/inicio'"
              [class.text-neutral-950]="activeRoute !== '/dashboard/inicio'"
            >
              <ng-icon hlm name="lucideHome" size="20px" />
              <span class="text-sm font-normal leading-5">Inicio</span>
            </button>
          </div>
        </div>

        <!-- Sección: Inscripciones -->
        <div>
          <div class="h-11 px-2 flex items-center gap-2.5">
            <div class="opacity-70 text-neutral-950 text-xs font-normal leading-4">
              Inscripciones
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <!-- Convocatorias (Activo) -->
            <button
              (click)="navegar('/dashboard/convocatorias')"
              class="w-full h-12 px-4 py-2 rounded-[200px] flex items-center gap-2 transition-colors"
              [class.bg-lime-600]="activeRoute === '/dashboard/convocatorias'"
              [class.text-white]="activeRoute === '/dashboard/convocatorias'"
              [class.text-neutral-950]="activeRoute !== '/dashboard/convocatorias'"
              [class.hover:bg-lime-50]="activeRoute !== '/dashboard/convocatorias'"
            >
              <ng-icon hlm name="lucideFileText" size="20px" />
              <span class="text-sm font-normal leading-5">Convocatorias</span>
            </button>

            <!-- Aspirantes -->
            <button
              (click)="navegar('/dashboard/aspirantes')"
              class="w-full h-11 px-4 py-2 rounded-[200px] flex items-center gap-2 hover:bg-lime-50 transition-colors"
              [class.bg-lime-600]="activeRoute === '/dashboard/aspirantes'"
              [class.text-white]="activeRoute === '/dashboard/aspirantes'"
              [class.text-neutral-950]="activeRoute !== '/dashboard/aspirantes'"
            >
              <ng-icon hlm name="lucideUsers" size="20px" />
              <span class="text-sm font-normal leading-5">Aspirantes</span>
            </button>

            <!-- Tutores -->
            <button
              (click)="navegar('/dashboard/tutores')"
              class="w-full h-11 px-4 py-2 rounded-[200px] flex items-center gap-2 hover:bg-lime-50 transition-colors"
              [class.bg-lime-600]="activeRoute === '/dashboard/tutores'"
              [class.text-white]="activeRoute === '/dashboard/tutores'"
              [class.text-neutral-950]="activeRoute !== '/dashboard/tutores'"
            >
              <ng-icon hlm name="lucideUserCircle" size="20px" />
              <span class="text-sm font-normal leading-5">Tutores</span>
            </button>

            <!-- Adjunciones -->
            <button
              (click)="navegar('/dashboard/adjunciones')"
              class="w-full h-11 px-4 py-2 rounded-[200px] flex items-center gap-2 hover:bg-lime-50 transition-colors"
              [class.bg-lime-600]="activeRoute === '/dashboard/adjunciones'"
              [class.text-white]="activeRoute === '/dashboard/adjunciones'"
              [class.text-neutral-950]="activeRoute !== '/dashboard/adjunciones'"
            >
              <ng-icon hlm name="lucideBookOpen" size="20px" />
              <span class="text-sm font-normal leading-5">Adjunciones</span>
            </button>
          </div>
        </div>

        <!-- Sección: Alumnos -->
        <div>
          <div class="h-11 px-2 flex items-center gap-2.5">
            <div class="opacity-70 text-neutral-950 text-xs font-normal leading-4">Alumnos</div>
          </div>
          <div class="flex flex-col gap-2">
            <button
              (click)="navegar('/dashboard/alumnos')"
              class="w-full h-11 px-4 py-2 rounded-[200px] flex items-center gap-2 hover:bg-lime-50 transition-colors"
              [class.bg-lime-600]="activeRoute === '/dashboard/alumnos'"
              [class.text-white]="activeRoute === '/dashboard/alumnos'"
              [class.text-neutral-950]="activeRoute !== '/dashboard/alumnos'"
            >
              <ng-icon hlm name="lucideUsers" size="20px" />
              <span class="text-sm font-normal leading-5">Alumnos</span>
            </button>

            <button
              (click)="navegar('/dashboard/grupos')"
              class="w-full h-11 px-4 py-2 rounded-[200px] flex items-center gap-2 hover:bg-lime-50 transition-colors"
              [class.bg-lime-600]="activeRoute === '/dashboard/grupos'"
              [class.text-white]="activeRoute === '/dashboard/grupos'"
              [class.text-neutral-950]="activeRoute !== '/dashboard/grupos'"
            >
              <ng-icon hlm name="lucideCalendar" size="20px" />
              <span class="text-sm font-normal leading-5">Grupos</span>
            </button>

            <button
              (click)="navegar('/dashboard/actividades')"
              class="w-full h-11 px-4 py-2 rounded-[200px] flex items-center gap-2 hover:bg-lime-50 transition-colors"
              [class.bg-lime-600]="activeRoute === '/dashboard/actividades'"
              [class.text-white]="activeRoute === '/dashboard/actividades'"
              [class.text-neutral-950]="activeRoute !== '/dashboard/actividades'"
            >
              <ng-icon hlm name="lucideClipboardList" size="20px" />
              <span class="text-sm font-normal leading-5">Actividades</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer con información del usuario -->
      <div class="p-2">
        <div class="h-14 p-2 flex items-center gap-2">
          <hlm-avatar size="lg" class="size-8 rounded-lg">
            <!-- <img hlmAvatarImage src="https://placehold.co/32x32" alt="Avatar" /> -->
            <span hlmAvatarFallback>AQ</span>
          </hlm-avatar>
          <div class="flex-1">
            <div class="text-zinc-700 text-sm font-semibold leading-5">Aquiles</div>
            <div class="text-zinc-700 text-xs font-normal leading-4">m@example.com</div>
          </div>
          <ng-icon
            hlm
            name="lucideLogOut"
            size="16px"
            class="text-zinc-700 cursor-pointer"
          ></ng-icon>
        </div>
      </div>
    </div>

    <!-- Router outlet para el contenido dinámico -->
    <router-outlet />
  `,
  providers: [
    provideIcons({
      lucideHome,
      lucideInbox,
      lucideCalendar,
      lucideSearch,
      lucideSettings,
    }),
  ],
})
export class AppSidebar {
  protected readonly _items = [
    {
      title: 'Inicio',
      url: '#',
      icon: 'lucideHome',
    },
    {
      title: 'Inbox',
      url: '#',
      icon: 'lucideInbox',
    },
    {
      title: 'Calendar',
      url: '#',
      icon: 'lucideCalendar',
    },
    {
      title: 'Search',
      url: '#',
      icon: 'lucideSearch',
    },
    {
      title: 'Settings',
      url: '#',
      icon: 'lucideSettings',
    },
  ];

  constructor(private router: Router) {}
  activeRoute: string = '/dashboard/inicio';

  // ✅ Método básico de navegación
  navegar(route: string) {
    this.router.navigate([route]);
  }
}
