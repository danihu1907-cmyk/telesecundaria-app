import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar } from '../../components/sidebar/sidebar';
import { SiteHeader } from '../../components/site-header/site-header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'admin-dashboard',
  imports: [HlmSidebarImports, SiteHeader, AppSidebar, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <!-- Sidebar -->
    <app-sidebar>
      <main hlmSidebarInset class="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden">
        <!-- site-header -->
        <site-header />
        <!-- Dynamic Content -->
        <section class="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <router-outlet />
        </section>
      </main>
    </app-sidebar>
  `,
})
export class AdminDashboard {}
