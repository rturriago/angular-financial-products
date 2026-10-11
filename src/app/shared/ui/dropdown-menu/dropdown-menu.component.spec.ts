import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownMenuComponent } from './dropdown-menu.component';

describe('DropdownMenuComponent', () => {
  let fixture: ComponentFixture<DropdownMenuComponent>;
  let element: HTMLElement;
  let selected: string[];

  beforeEach(() => {
    selected = [];
    fixture = TestBed.createComponent(DropdownMenuComponent);
    fixture.componentRef.setInput('items', [
      { id: 'edit', label: 'Editar' },
      { id: 'other', label: 'Otra opción' },
    ]);
    fixture.componentRef.setInput('ariaLabel', 'Acciones para Tarjeta');
    fixture.componentInstance.itemSelected.subscribe((id) => selected.push(id));
    element = fixture.nativeElement;
    document.body.appendChild(element);
    fixture.detectChanges();
  });

  afterEach(() => {
    element.remove();
  });

  function trigger(): HTMLButtonElement {
    return element.querySelector<HTMLButtonElement>('.dropdown-menu__trigger')!;
  }

  function menu(): HTMLElement | null {
    return element.querySelector('[role="menu"]');
  }

  function open(): void {
    trigger().click();
    fixture.detectChanges();
  }

  it('should start closed with an accessible trigger', () => {
    expect(menu()).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().getAttribute('aria-label')).toBe('Acciones para Tarjeta');
  });

  it('should open the menu with every item when the trigger is clicked', () => {
    open();

    const labels = Array.from(element.querySelectorAll('[role="menuitem"]')).map((item) =>
      item.textContent?.trim(),
    );
    expect(labels).toEqual(['Editar', 'Otra opción']);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('should close when the trigger is clicked again', () => {
    open();
    open();

    expect(menu()).toBeNull();
  });

  it('should emit the item id and close when an item is selected', () => {
    open();

    element.querySelector<HTMLButtonElement>('[role="menuitem"]')!.click();
    fixture.detectChanges();

    expect(selected).toEqual(['edit']);
    expect(menu()).toBeNull();
  });

  it('should close when clicking outside', () => {
    open();

    document.body.click();
    fixture.detectChanges();

    expect(menu()).toBeNull();
  });

  it('should stay open when clicking inside', () => {
    open();

    menu()!.click();
    fixture.detectChanges();

    expect(menu()).not.toBeNull();
  });

  it('should close when pressing Escape', () => {
    open();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(menu()).toBeNull();
  });
});
