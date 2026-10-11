import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { ApiError } from '../../../../core/http/api-error';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductRepository } from '../../data-access/product.repository';
import { Product } from '../../models/product.model';
import { buildProduct } from '../../testing/product.fixtures';
import { CreateProductPage } from './create-product.page';
import { createProductRepositoryMock } from '../../testing/product-repository.mock';

describe('CreateProductPage', () => {
  let fixture: ComponentFixture<CreateProductPage>;
  let element: HTMLElement;
  let repositoryMock: jest.Mocked<ProductRepository>;
  let router: Router;

  beforeEach(() => {
    repositoryMock = createProductRepositoryMock();
    repositoryMock.existsById.mockReturnValue(of(false));
    TestBed.configureTestingModule({
      imports: [CreateProductPage],
      providers: [provideRouter([]), { provide: ProductRepository, useValue: repositoryMock }],
    });

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture = TestBed.createComponent(CreateProductPage);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  function submitFromForm(product: Product): void {
    const form = fixture.debugElement.query(
      (debugElement) => debugElement.componentInstance instanceof ProductFormComponent,
    ).componentInstance as ProductFormComponent;
    form.submitted.emit(product);
    fixture.detectChanges();
  }

  it('should create the product, notify the success and go back to the list', () => {
    const notificationSpy = jest
      .spyOn(TestBed.inject(NotificationService), 'success')
      .mockImplementation(() => undefined);
    const product = buildProduct({ id: 'nuevo', name: 'Tarjeta Platinum' });
    repositoryMock.create.mockReturnValue(of(product));

    submitFromForm(product);

    expect(repositoryMock.create).toHaveBeenCalledWith(product);
    expect(notificationSpy).toHaveBeenCalledWith(
      'Producto "Tarjeta Platinum" agregado correctamente',
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith('/products');
  });

  it('should tell the form it is submitting while the request is in progress', () => {
    const pendingCreation = new Subject<Product>();
    repositoryMock.create.mockReturnValue(pendingCreation);

    submitFromForm(buildProduct());
    expect(element.textContent).toContain('Enviando...');

    pendingCreation.next(buildProduct());
    pendingCreation.complete();
    fixture.detectChanges();
    expect(element.textContent).not.toContain('Enviando...');
  });

  it('should show the error and stay on the page when the creation fails', () => {
    repositoryMock.create.mockReturnValue(
      throwError(() => new ApiError('Los datos enviados no son válidos.', 400)),
    );

    submitFromForm(buildProduct());

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Los datos enviados no son válidos.',
    );
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should offer a link back to the list', () => {
    const backLink = element.querySelector('a');

    expect(backLink?.getAttribute('href')).toBe('/products');
  });
});
