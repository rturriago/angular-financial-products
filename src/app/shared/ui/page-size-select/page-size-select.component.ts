import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'app-page-size-select',
  templateUrl: './page-size-select.component.html',
  styleUrl: './page-size-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSizeSelectComponent {
  readonly options = input.required<readonly number[]>();
  readonly value = model.required<number>();

  onChange(event: Event): void {
    this.value.set(Number((event.target as HTMLSelectElement).value));
  }
}
