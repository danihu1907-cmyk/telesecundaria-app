import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <button
      (click)="navigate.emit()"
      class="flex items-center gap-2 transition-all duration-200 cursor-pointer w-full"
      [class.px-4]="!collapsed"
      [class.py-2]="!collapsed"
      [class.rounded-[200px]]="!collapsed"
      [class.px-2]="collapsed"
      [class.py-3]="collapsed"
      [class.rounded-lg]="collapsed"
      [class.justify-center]="collapsed"
      [class.bg-lime-600]="active"
      [class.text-white]="active"
      [class.text-neutral-950]="!active"
      [class.hover:bg-lime-100]="!active"
    >
      <!-- Icono -->
      <div class="size-5 relative overflow-hidden shrink-0">
        <ng-icon
          hlm
          [name]="icon"
          size="20px"
          [class.text-white]="active"
          [class.text-neutral-950]="!active"
        />
      </div>

      <!-- Label -->
      @if (!collapsed) {
        <span class="text-sm font-normal leading-5">{{ label }}</span>
      }
    </button>
  `,
})
export class SidebarItemComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() active = false;
  @Input() collapsed = false;
  @Output() navigate = new EventEmitter<void>();
}
