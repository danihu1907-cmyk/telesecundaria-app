import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
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
      <main hlmSidebarInset>
        <!-- site-header -->
        <site-header />
        <!-- Dynamic Content -->
        <router-outlet />
        <!-- <div class="flex flex-1 flex-col gap-4 p-4">
          <div class="grid auto-rows-min gap-4 md:grid-cols-3">
            <div class="bg-muted/50 aspect-video rounded-xl"></div>
            <div class="bg-muted/50 aspect-video rounded-xl"></div>
            <div class="bg-muted/50 aspect-video rounded-xl"></div>
          </div>
          <div class="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min"></div>
        </div> -->
      </main>
    </app-sidebar>
  `,
})
export class AdminDashboard {}
