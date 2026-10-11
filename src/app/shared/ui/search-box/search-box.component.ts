import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent {
  readonly value = model('');
  readonly placeholder = input('Search...');
  readonly label = input('Buscar');

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
