import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { RouterModule } from '@angular/router';
import {
  lucideHome,
  lucideChevronDown,
  lucideBoxes,
  lucideLifeBuoy,
  lucideSend,
  lucideBuilding,
  lucideCalendar,
  lucideSettings,
  lucideInbox,
  lucideSearch,
  lucideChevronRight,
  lucideBookOpen,
  lucideClipboardList,
  lucideUsers,
  lucideFolderPlus,
  lucideGraduationCap,
  lucideBook,
  lucideFileCheck,
  lucideCalendarClock,
  lucideFile,
  lucideFileText,
} from '@ng-icons/lucide';

import { INDEPENDENT_ITEMS, MENU_GROUPS, MenuGroup } from '../../models/menu-item.models';
import { SidebarItemComponent } from './sidebar-item';

@Component({
  selector: 'app-sidebar',
  imports: [
    HlmSidebarImports,
    HlmAvatarImports,
    NgIcon,
    HlmIcon,
    RouterModule,
    SidebarItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div hlmSidebarWrapper class="h-svh overflow-hidden">
      <hlm-sidebar variant="inset">
        <!-- Header con logo y nombre de escuela -->
        <hlm-sidebar-header>
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <a hlmSidebarMenuButton size="lg" href="#">
                <div
                  class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                >
                  <ng-icon name="lucideBuilding" class="text-base" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">Silvestre Aguilar Vargas</span>
                </div>
              </a>
            </li>
          </ul>
        </hlm-sidebar-header>
        <!-- contenido del sidebar -->
        <div hlmSidebarContent>
          <div class="px-4 pt-2 pb-6 flex flex-col gap-4 overflow-y-auto flex-1">
            <!-- BOTONES INDEPENDIENTES  -->

            <!-- Inicio -->
            <app-sidebar-item
              label="Inicio"
              icon="lucideHome"
              [active]="isActive('/dashboard/inicio')"
              [collapsed]="collapsed"
              (navigate)="navegar('/dashboard/inicio')"
            />
            <!-- Expedientes -->
            <app-sidebar-item
              label="Expedientes"
              icon="lucideFileText"
              [active]="isActive('/dashboard/expedientes')"
              [collapsed]="collapsed"
              (navigate)="navegar('/dashboard/expedientes')"
            />
            <!-- Usuarios -->
            <app-sidebar-item
              label="Usuarios"
              icon="lucideUsers"
              [active]="isActive('/dashboard/usuarios')"
              [collapsed]="collapsed"
              (navigate)="navegar('/dashboard/usuarios')"
            />

            <!-- Galeria -->
            <app-sidebar-item
              label="Galería"
              icon="lucideFolderPlus"
              [active]="isActive('/dashboard/galeria')"
              [collapsed]="collapsed"
              (navigate)="navegar('/dashboard/galeria')"
            />

            @for (group of menuGroups; track group.label) {
              <div class="flex flex-col">
                <!-- Group Header -->
                @if (!collapsed) {
                  <button
                    type="button"
                    class="h-11 px-2 flex items-center justify-between w-full hover:bg-neutral-100 rounded-md transition-colors"
                    (click)="group.expanded = !group.expanded"
                  >
                    <span class="opacity-70 text-neutral-950 text-sm font-normal leading-4">
                      {{ group.label }}
                    </span>

                    <ng-icon
                      hlm
                      name="lucideChevronRight"
                      size="16px"
                      class="transition-transform duration-200"
                      [class.rotate-90]="group.expanded"
                    />
                  </button>
                }

                <!-- Group Items -->
                <div
                  class="overflow-hidden transition-all duration-300"
                  [style.maxHeight]="group.expanded ? '500px' : '0px'"
                >
                  <div class="flex flex-col gap-2">
                    @for (item of group.items; track item.title) {
                      <app-sidebar-item
                        [label]="item.title"
                        [icon]="item.icon"
                        [active]="isActive(item.route)"
                        [collapsed]="collapsed"
                        (navigate)="navegar(item.route)"
                      />
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        <!-- footer -->
        <hlm-sidebar-footer>
          <div hlmSidebarFooter>
            <button hlmSidebarMenuButton size="lg">
              <hlm-avatar size="lg">
                <span hlmAvatarFallback>AQ</span>
              </hlm-avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">Aquiles</span>
                <span class="truncate text-xs">aquiles@example.com</span>
              </div>
            </button>
          </div>
        </hlm-sidebar-footer>
      </hlm-sidebar>
      <ng-content />
    </div>
  `,
  providers: [
    provideIcons({
      lucideHome,
      lucideUsers,
      lucideChevronRight,
      lucideInbox,
      lucideCalendar,
      lucideSearch,
      lucideSettings,
      lucideBuilding,
      lucideLifeBuoy,
      lucideSend,
      lucideChevronDown,
      lucideFolderPlus,
      lucideBookOpen,
      lucideBook,
      lucideClipboardList,
      lucideGraduationCap,
      lucideBoxes,
      lucideFileCheck,
      lucideCalendarClock,
      lucideFile,
      lucideFileText,
    }),
  ],
})
export class AppSidebar {
  constructor(private router: Router) {}

  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  independentItems = INDEPENDENT_ITEMS;
  menuGroups: MenuGroup[] = MENU_GROUPS;

  isActive(route: string): boolean {
    return this.router.isActive(route, {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    });
  }

  activeRoute: string = '/dashboard/inicio';

  // ✅ Método básico de navegación
  navegar(route: string) {
    this.router.navigate([route]);
  }
}
