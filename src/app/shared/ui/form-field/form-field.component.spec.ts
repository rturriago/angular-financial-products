import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {
  let fixture: ComponentFixture<FormFieldComponent>;

  function render(inputs: { error?: string | null; hint?: string | null } = {}): HTMLElement {
    fixture = TestBed.createComponent(FormFieldComponent);
    fixture.componentRef.setInput('label', 'Nombre');
    fixture.componentRef.setInput('fieldId', 'name');
    fixture.componentRef.setInput('error', inputs.error ?? null);
    fixture.componentRef.setInput('hint', inputs.hint ?? null);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('should link the label to the field id', () => {
    const label = render().querySelector('label');

    expect(label?.textContent?.trim()).toBe('Nombre');
    expect(label?.getAttribute('for')).toBe('name');
  });

  it('should show the error message with an id for aria-describedby', () => {
    const error = render({ error: 'Este campo es requerido!' }).querySelector(
      '.form-field__message--error',
    );

    expect(error?.textContent?.trim()).toBe('Este campo es requerido!');
    expect(error?.id).toBe('name-error');
  });

  it('should show the hint only when there is no error', () => {
    expect(render({ hint: 'Verificando...' }).textContent).toContain('Verificando...');
    expect(render({ hint: 'Verificando...', error: 'Error' }).textContent).not.toContain(
      'Verificando...',
    );
  });
});
