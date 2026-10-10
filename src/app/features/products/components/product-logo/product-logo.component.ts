import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { getInitials } from '../../../../shared/utils/get-initials';

@Component({
  selector: 'app-product-logo',
  templateUrl: './product-logo.component.html',
  styleUrl: './product-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductLogoComponent {
  readonly logo = input.required<string>();
  readonly name = input.required<string>();

  private readonly hasImageError = signal(false);

  readonly showImage = computed(() => Boolean(this.logo()) && !this.hasImageError());
  readonly initials = computed(() => getInitials(this.name()));

  onImageError(): void {
    this.hasImageError.set(true);
  }
}
