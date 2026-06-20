import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import {
  HlmDrawerFooter,
  HlmDrawerHeader,
  HlmDrawer,
  HlmDrawerContent,
  HlmDrawerPortal,
  HlmDrawerTrigger,
} from '../../../../../../libs/ui/drawer/src';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lucidePlus } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'crear-convocatorias',
  standalone: true,
  imports: [
    HlmButtonImports,
    HlmFieldImports,
    HlmInputImports,
    HlmDrawerFooter,
    HlmDrawerHeader,
    HlmDrawer,
    HlmDrawerContent,
    HlmDrawerPortal,
    NgIcon,
    HlmDrawerTrigger,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-drawer>
      <button
        id="crear-convocatorias-button"
        hlmDrawerTrigger
        direction="right"
        hlmBtn
        variant="outline"
        class="ml-auto rounded-full border-lime-600 bg-lime-50 text-lime-600 hover:bg-lime-100 hover:text-lime-600"
      >
        <ng-icon name="lucidePlus" />
        Crear convocatoria
      </button>
      <!-- Modal -->
      <hlm-drawer-content *hlmDrawerPortal="let ctx">
        <hlm-drawer-header>
          <h3 hlmDrawerTitle>Crear Convocatoria</h3>
          <p hlmDrawerDescription>
            Cree una nueva convocatoria aquí. Haga clic en guardar cuando haya terminado.
          </p>
        </hlm-drawer-header>
        <hlm-field-group class="px-4">
          <hlm-field>
            <label hlmFieldLabel for="name">Name</label>
            <input hlmInput id="name" value="Pedro Duarte" />
          </hlm-field>
          <hlm-field>
            <label hlmFieldLabel for="username">Username</label>
            <input hlmInput id="username" value="peduarte" />
          </hlm-field>
        </hlm-field-group>
        <hlm-drawer-footer>
          <button hlmBtn type="submit">Save Changes</button>
          <button hlmDrawerClose hlmBtn variant="outline">Cancel</button>
        </hlm-drawer-footer>
      </hlm-drawer-content>
    </hlm-drawer>
  `,

  providers: [
    provideIcons({
      lucidePlus,
    }),
  ],
})
export class CrearConvocatorias {}
