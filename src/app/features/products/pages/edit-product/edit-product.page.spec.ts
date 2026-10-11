import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { ApiError } from '../../../../core/http/api-error';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductRepository } from '../../data-access/product.repository';
import { Product } from '../../models/product.model';
import { buildProduct } from '../../testing/product.fixtures';
import { createProductRepositoryMock } from '../../testing/product-repository.mock';
import { EditProductPage } from './edit-product.page';

describe('EditProductPage', () => {
  let fixture: ComponentFixture<EditProductPage>;
  let element: HTMLElement;
  let repositoryMock: jest.Mocked<ProductRepository>;
  let router: Router;
  const product = buildProduct({ id: 'trj-crd', name: 'Tarjeta de Crédito' });

  beforeEach(() => {
    repositoryMock = createProductRepositoryMock();
    TestBed.configureTestingModule({
      imports: [EditProductPage],
      providers: [provideRouter([]), { provide: ProductRepository, useValue: repositoryMock }],
    });
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  function render(id = 'trj-crd'): void {
    fixture = TestBed.createComponent(EditProductPage);
    fixture.componentRef.setInput('id', id);
    element = fixture.nativeElement;
    fixture.detectChanges();
  }

  function form(): ProductFormComponent {
    return fixture.debugElement.query(
      (debugElement) => debugElement.componentInstance instanceof ProductFormComponent,
    ).componentInstance as ProductFormComponent;
  }

  it('should load the product from the route id and fill the locked form', () => {
    repositoryMock.getById.mockReturnValue(of(product));

    render();

    expect(repositoryMock.getById).toHaveBeenCalledWith('trj-crd');
    expect(form().initialProduct()).toEqual(product);
    expect(form().lockId()).toBe(true);
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Editar Producto');
  });

  it('should show a loading message while the product is being fetched', () => {
    const pendingProduct = new Subject<Product>();
    repositoryMock.getById.mockReturnValue(pendingProduct);

    render();

    expect(element.textContent).toContain('Cargando producto...');
  });

  it('should show the error when the product does not exist', () => {
    repositoryMock.getById.mockReturnValue(
      throwError(() => new ApiError('El producto solicitado no existe.', 404)),
    );

    render('no-existe');

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'El producto solicitado no existe.',
    );
    expect(element.querySelector('app-product-form')).toBeNull();
  });

  it('should send the changes without the id, notify the success and go back to the list', () => {
    const notificationSpy = jest
      .spyOn(TestBed.inject(NotificationService), 'success')
      .mockImplementation(() => undefined);
    repositoryMock.getById.mockReturnValue(of(product));
    repositoryMock.update.mockReturnValue(of({ ...product, name: 'Tarjeta Oro' }));
    render();

    form().submitted.emit({ ...product, name: 'Tarjeta Oro' });

    const { id, ...changes } = product;
    expect(repositoryMock.update).toHaveBeenCalledWith(id, { ...changes, name: 'Tarjeta Oro' });
    expect(notificationSpy).toHaveBeenCalledWith(
      'Producto "Tarjeta Oro" actualizado correctamente',
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith('/products');
  });

  it('should show the save error and stay on the page when the update fails', () => {
    repositoryMock.getById.mockReturnValue(of(product));
    repositoryMock.update.mockReturnValue(
      throwError(() => new ApiError('El producto solicitado no existe.', 404)),
    );
    render();

    form().submitted.emit(product);
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'El producto solicitado no existe.',
    );
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
