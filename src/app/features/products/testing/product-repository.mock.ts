import { ProductRepository } from '../data-access/product.repository';

export function createProductRepositoryMock(): jest.Mocked<ProductRepository> {
  return {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    existsById: jest.fn(),
  };
}
