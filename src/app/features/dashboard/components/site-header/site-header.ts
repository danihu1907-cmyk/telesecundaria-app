import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { hlmH3 } from '../../../../../../libs/ui/typography/src/lib/hlm-h3';
import { CrearConvocatorias } from '../modales/convocatorias/modal-crear-convocatorias';

@Component({
  selector: 'site-header',
  imports: [HlmSidebarImports, HlmSeparatorImports, HlmButtonImports, CrearConvocatorias],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex h-16 shrink-0 items-center px-2">
      <div class="flex w-full min-w-0 items-center gap-2 px-2">
        <button hlmSidebarTrigger></button>
        <hlm-separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-6" />

        <h3 class="${hlmH3} text-lime-600">{{ title }}</h3>

        <div class="ml-auto">
          <crear-convocatorias />
        </div>
      </div>
    </header>
  `,
  providers: [provideIcons({ lucidePlus })],
})
export class SiteHeader {
  title = 'Dashboard';

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let currentRoute = this.route;

      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      this.title = currentRoute.snapshot.data['title'] ?? 'Dashboard';

      this.cdr.markForCheck();
    });
  }
}
