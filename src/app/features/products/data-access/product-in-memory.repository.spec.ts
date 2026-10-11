import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ApiError } from '../../../core/http/api-error';
import { buildProduct } from '../testing/product.fixtures';
import { ProductInMemoryRepository } from './product-in-memory.repository';
import { ProductRepository } from './product.repository';

describe('ProductInMemoryRepository', () => {
  let repository: ProductRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ProductRepository, useClass: ProductInMemoryRepository }],
    });
    repository = TestBed.inject(ProductRepository);
  });

  it('should start with the seed products', async () => {
    const products = await firstValueFrom(repository.getAll());

    expect(products.length).toBeGreaterThan(0);
  });

  it('should get an existing product by id', async () => {
    const product = await firstValueFrom(repository.getById('trj-crd'));

    expect(product.id).toBe('trj-crd');
  });

  it('should fail with status 404 when getting a missing product', async () => {
    await expect(firstValueFrom(repository.getById('no-existe'))).rejects.toMatchObject({
      status: 404,
    });
  });

  it('should create a product and include it in the list', async () => {
    const product = buildProduct({ id: 'nuevo' });

    await firstValueFrom(repository.create(product));
    const products = await firstValueFrom(repository.getAll());

    expect(products).toContainEqual(product);
  });

  it('should fail with status 400 when creating a duplicated id', async () => {
    const product = buildProduct({ id: 'trj-crd' });

    await expect(firstValueFrom(repository.create(product))).rejects.toMatchObject({
      status: 400,
    });
  });

  it('should update an existing product keeping its id', async () => {
    const { id, ...changes } = buildProduct({ id: 'trj-crd', name: 'Tarjeta Platinum' });

    const updated = await firstValueFrom(repository.update(id, changes));
    const products = await firstValueFrom(repository.getAll());

    expect(updated).toEqual({ id, ...changes });
    expect(products.find((product) => product.id === id)?.name).toBe('Tarjeta Platinum');
  });

  it('should fail with an ApiError 404 when updating a missing product', async () => {
    const { id, ...changes } = buildProduct({ id: 'no-existe' });

    const request = firstValueFrom(repository.update(id, changes));

    await expect(request).rejects.toBeInstanceOf(ApiError);
    await expect(request).rejects.toMatchObject({ status: 404 });
  });

  it.each([
    ['trj-crd', true],
    ['no-existe', false],
  ])('should report whether id "%s" exists (%s)', async (id, expected) => {
    expect(await firstValueFrom(repository.existsById(id))).toBe(expected);
  });

  it('should not expose its internal state to external mutations', async () => {
    const [first] = await firstValueFrom(repository.getAll());
    first.name = 'Mutado desde afuera';

    const [firstAgain] = await firstValueFrom(repository.getAll());

    expect(firstAgain.name).not.toBe('Mutado desde afuera');
  });
});
