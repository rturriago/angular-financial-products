import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export interface DropdownMenuItem {
  id: string;
  label: string;
}

interface MenuPosition {
  top: number;
  right: number;
}

const MENU_OFFSET_PX = 4;

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'close()',
    '(window:resize)': 'close()',
    '(window:scroll)': 'close()',
  },
})
export class DropdownMenuComponent {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly items = input.required<DropdownMenuItem[]>();
  readonly ariaLabel = input('Opciones');
  readonly itemSelected = output<string>();

  readonly isOpen = signal(false);
  readonly position = signal<MenuPosition>({ top: 0, right: 0 });

  toggle(trigger: HTMLElement): void {
    if (this.isOpen()) {
      this.close();
      return;
    }
    const triggerRect = trigger.getBoundingClientRect();
    this.position.set({
      top: triggerRect.bottom + MENU_OFFSET_PX,
      right: window.innerWidth - triggerRect.right,
    });
    this.isOpen.set(true);
  }

  select(item: DropdownMenuItem): void {
    this.close();
    this.itemSelected.emit(item.id);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.hostElement.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }
}
