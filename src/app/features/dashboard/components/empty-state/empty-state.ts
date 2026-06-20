import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookOpen } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmIcon } from '@spartan-ng/helm/icon';
import {
  HlmEmptyHeader,
  HlmEmptyMedia,
  HlmEmptyContent,
  HlmEmpty,
  HlmEmptyTitle,
  HlmEmptyDescription,
} from '../../../../../../libs/ui/empty/src';

@Component({
  selector: 'empty-state-convocatorias',
  imports: [
    NgIcon,
    HlmEmptyHeader,
    HlmEmptyMedia,
    HlmEmptyContent,
    HlmEmpty,
    HlmEmptyTitle,
    HlmEmptyDescription,
  ],
  template: `<div class="content-center">
    <hlm-empty>
      <hlm-empty-header>
        <hlm-empty-media variant="icon">
          <ng-icon name="lucideBookOpen" />
        </hlm-empty-media>
        <div hlmEmptyTitle>No hay niguna convocatoria</div>
        <div hlmEmptyDescription>
          Ene este espacio aparecerán las convocatorias que hayas creado, para crear una nueva
          convocatoria haz clic en el botón de "Crear convocatoria" en la parte superior derecha.
        </div>
      </hlm-empty-header>
      <hlm-empty-content class="flex-row justify-center gap-2"> </hlm-empty-content>
    </hlm-empty>
  </div> `,
  styleUrl: './empty-state.css',

  providers: [provideIcons({ lucideBookOpen })],
})
export class EmptyState {}
