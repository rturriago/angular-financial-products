import { TestBed } from '@angular/core/testing';
import { FormControl, ValidationErrors } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductRepository } from '../data-access/product.repository';
import {
  PRODUCT_ID_CHECK_DEBOUNCE_MS,
  UniqueProductIdValidator,
} from './unique-product-id.validator';

describe('UniqueProductIdValidator', () => {
  let validator: UniqueProductIdValidator;
  let repositoryMock: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    jest.useFakeTimers();
    repositoryMock = {
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      existsById: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: ProductRepository, useValue: repositoryMock }],
    });
    validator = TestBed.inject(UniqueProductIdValidator);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function validate(id: string): ValidationErrors | null | undefined {
    let result: ValidationErrors | null | undefined;
    validator.validate(new FormControl(id, { nonNullable: true })).subscribe((errors) => {
      result = errors;
    });
    jest.advanceTimersByTime(PRODUCT_ID_CHECK_DEBOUNCE_MS);
    return result;
  }

  it('should wait for the debounce time before calling the API', () => {
    repositoryMock.existsById.mockReturnValue(of(false));

    validator.validate(new FormControl('trj-crd', { nonNullable: true })).subscribe();
    jest.advanceTimersByTime(PRODUCT_ID_CHECK_DEBOUNCE_MS - 1);
    expect(repositoryMock.existsById).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(repositoryMock.existsById).toHaveBeenCalledWith('trj-crd');
  });

  it('should return null when the id is available', () => {
    repositoryMock.existsById.mockReturnValue(of(false));

    expect(validate('nuevo')).toBeNull();
  });

  it('should return idExists when the id is already taken', () => {
    repositoryMock.existsById.mockReturnValue(of(true));

    expect(validate('trj-crd')).toEqual({ idExists: true });
  });

  it('should trim the id before checking it', () => {
    repositoryMock.existsById.mockReturnValue(of(false));

    validate('  nuevo  ');

    expect(repositoryMock.existsById).toHaveBeenCalledWith('nuevo');
  });

  it('should return idVerificationFailed when the API fails', () => {
    repositoryMock.existsById.mockReturnValue(throwError(() => new Error('Network')));

    expect(validate('nuevo')).toEqual({ idVerificationFailed: true });
  });
});
