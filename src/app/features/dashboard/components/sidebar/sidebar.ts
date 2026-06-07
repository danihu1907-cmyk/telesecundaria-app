import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService } from '../../../../shared/services/sidebar.service';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

import {
  lucideCalendar,
  lucideHouse,
  lucideInbox,
  lucideSearch,
  lucideSettings,
} from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [HlmSidebarImports, HlmAvatarImports, NgIcon, HlmIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="_open" hlmSidebarWrapper>
      <hlm-sidebar variant="inset">
        <div hlmSidebarHeader></div>
        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupLabel>Escuela</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                @for (item of _items; track item.title) {
                  <li hlmSidebarMenuItem>
                    <a hlmSidebarMenuButton>
                      <ng-icon hlm [name]="item.icon" />
                      <span>{{ item.title }}</span>
                    </a>
                  </li>
                }
              </ul>
            </div>
          </div>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupLabel>Inscripciones</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                @for (item of _items; track item.title) {
                  <li hlmSidebarMenuItem>
                    <a hlmSidebarMenuButton>
                      <ng-icon hlm [name]="item.icon" />
                      <span>{{ item.title }}</span>
                    </a>
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>

        <div hlmSidebarFooter>
          <button hlmSidebarMenuButton size="lg">
            <hlm-avatar size="lg">
              <!-- <img hlmAvatarImage src="/files/avatar.png" alt="@spartan-ui logo" /> -->
              <span hlmAvatarFallback>AQ</span>
            </hlm-avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">Aquiles</span>
              <span class="truncate text-xs">aquiles@example.com</span>
            </div>
          </button>
        </div>
      </hlm-sidebar>
      <ng-content />
    </div>
  `,
  providers: [
    provideIcons({
      lucideHouse,
      lucideInbox,
      lucideCalendar,
      lucideSearch,
      lucideSettings,
    }),
  ],
})
export class AppSidebar implements OnDestroy {
  private _sub = new Subscription();
  protected _open = false;

  constructor(private sidebarService: SidebarService) {
    this._sub.add(this.sidebarService.open$.subscribe((v) => (this._open = v)));
  }
  protected readonly _items = [
    {
      title: 'Inicio',
      url: '#',
      icon: 'lucideHouse',
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

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
