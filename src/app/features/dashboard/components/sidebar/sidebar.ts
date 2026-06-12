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
} from '@ng-icons/lucide';

import { HlmCollapsible, HlmCollapsibleContent } from '../../../../../../libs/ui/collapsible/src';
import { MenuGroup } from '../../models/menu-item.models';

@Component({
  selector: 'app-sidebar',
  imports: [HlmSidebarImports, HlmAvatarImports, NgIcon, HlmIcon, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div hlmSidebarWrapper>
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
                      <button
                        (click)="navegar(item.route)"
                        class="group/item flex items-center gap-2 transition-all duration-200"
                        [class.px-4]="!collapsed"
                        [class.px-2]="collapsed"
                        [class.py-2]="!collapsed"
                        [class.py-3]="collapsed"
                        [class.justify-center]="collapsed"
                        [class.w-full]="!collapsed"
                        [class.rounded-[200px]]="!collapsed"
                        [class.rounded-lg]="collapsed"
                        [class.bg-lime-600]="isActive(item.route)"
                        [class.text-white]="isActive(item.route)"
                        [class.text-neutral-950]="!isActive(item.route)"
                        [class.hover:bg-lime-100]="!isActive(item.route)"
                      >
                        <!-- Icon -->
                        <div class="size-5 relative overflow-hidden shrink-0">
                          @if (isActive(item.route)) {
                            <ng-icon hlm [name]="item.icon" size="20px" class="text-white" />
                          } @else {
                            <ng-icon hlm [name]="item.icon" size="20px" class="text-neutral-950" />
                          }
                        </div>

                        <!-- Label -->
                        @if (!collapsed) {
                          <span class="text-sm font-normal leading-5">
                            {{ item.title }}
                          </span>
                        }
                      </button>
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
    <!-- Router outlet para el contenido dinámico -->
    <router-outlet />
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
    }),
  ],
})
export class AppSidebar {
  constructor(private router: Router) {}

  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  menuGroups: MenuGroup[] = [
    {
      label: 'Escuela',
      expanded: true,
      items: [{ title: 'Inicio', route: '/dashboard/inicio', icon: 'lucideHome' }],
    },
    {
      label: 'Convocatorias',
      expanded: true,
      items: [
        { title: 'Convocatorias', route: '/dashboard/convocatorias', icon: 'lucideBookOpen' },
        { title: 'Aspirantes', route: '/dashboard/aspirantes', icon: 'lucideClipboardList' },
        { title: 'Revisiones', route: '/dashboard/revisiones', icon: 'lucideFileCheck' },
        { title: 'Adjunciones', route: '/dashboard/adjunciones', icon: 'lucideFolderPlus' },
      ],
    },
    {
      label: 'Inscripciones',
      expanded: true,
      items: [
        { title: 'Inscripciones', route: '/dashboard/inscripciones', icon: 'lucideGraduationCap' },
        { title: 'Citas', route: '/dashboard/grupos', icon: 'lucideCalendarClock' },
        { title: 'Entregas', route: '/dashboard/actividades', icon: 'lucideFile' },
        { title: 'Cotejos', route: '/dashboard/tutores', icon: 'lucideUsers' },
      ],
    },

    {
      label: 'Alumnos',
      expanded: false,
      items: [
        { title: 'Alumnos', route: '/dashboard/alumnos', icon: 'lucideGraduationCap' },
        { title: 'Grupos', route: '/dashboard/grupos', icon: 'lucideBoxes' },
        { title: 'Actividades', route: '/dashboard/actividades', icon: 'lucideBook' },
      ],
    },
  ];

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  activeRoute: string = '/dashboard/inicio';

  // ✅ Método básico de navegación
  navegar(route: string) {
    this.router.navigate([route]);
  }
}
