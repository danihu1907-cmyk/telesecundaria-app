import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { hlmH4 } from '../../../../../../libs/ui/typography/src/lib/hlm-h4';

@Component({
  selector: 'site-header',
  imports: [HlmSidebarImports, HlmSeparatorImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex h-16 shrink-0 items-center gap-2">
      <div class="flex items-center gap-2 px-4">
        <button hlmSidebarTrigger></button>
        <hlm-separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <nav>
          <h4 class="${hlmH4}">Convocatorias</h4>

          <!-- <ol hlmBreadcrumbList>
            <li hlmBreadcrumbItem class="hidden sm:block">
              <a hlmBreadcrumbLink link="/"></a>
            </li>
            <li hlmBreadcrumbSeparator class="hidden sm:block"></li>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbPage>Data Fetching</a>
            </li>
          </ol> -->
        </nav>
      </div>
    </header>
  `,
})
export class SiteHeader {}
