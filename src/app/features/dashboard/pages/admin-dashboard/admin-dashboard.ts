import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar } from '../../components/sidebar/sidebar';
import { SiteHeader } from '../../components/site-header/site-header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'admin-dashboard',
  imports: [HlmSidebarImports, SiteHeader, AppSidebar, RouterOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  // styleUrl: '../../blocks-preview-default.css',
  template: `
    <!-- Sidebar -->
    <app-sidebar />

    <!-- Main Content Area -->
    <main hlmSidebarInset class="transition-all duration-300">
      <!-- Header -->
      <site-header />

      <!-- Dynamic Content -->
      <div class="flex-1 p-6">
        <router-outlet />
      </div>
    </main>
  `,
})
export class AdminDashboard {}
