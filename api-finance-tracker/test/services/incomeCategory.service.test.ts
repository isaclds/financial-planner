import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IncomeCategoryService } from '@src/services/IncomeCategory.service';
import { IncomeCategoryRepository } from '@src/repositories/index';
import { ValidationError } from '@src/errors/ValidationError';
import { EntityNotFound } from '@src/errors/EntityNotFound';

describe('IncomeCategoryService', () => {
  let service: IncomeCategoryService;
  let mockRepository: IncomeCategoryRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as IncomeCategoryRepository;

    service = new IncomeCategoryService(mockRepository);
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [{ id: 1, name: 'Salary' }];
      vi.mocked(mockRepository.findAll).mockResolvedValue(categories);

      const result = await service.findAll();

      expect(result).toEqual(categories);
      expect(mockRepository.findAll).toHaveBeenCalledOnce();
    });

    it('should return an empty array when there are no categories', async () => {
      vi.mocked(mockRepository.findAll).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return the category when the id is valid', async () => {
      const category = { id: 1, name: 'Freelance' };
      vi.mocked(mockRepository.findById).mockResolvedValue(category);

      const result = await service.findById(1);

      expect(result).toEqual(category);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should convert a string id to number before calling the repository', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue({
        id: 2,
        name: 'Investments',
      });

      await service.findById('2');

      expect(mockRepository.findById).toHaveBeenCalledWith(2);
    });

    it('should throw ValidationError when the id is not a valid number', async () => {
      await expect(service.findById('abc')).rejects.toMatchObject({
        message:
          'The income category id is required and must be a valid number',
      });
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when the id is empty', async () => {
      await expect(service.findById('')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError when the id is zero', async () => {
      await expect(service.findById(0)).rejects.toThrow(ValidationError);
    });

    it('should return null when the category is not found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create the category with the given name', async () => {
      const created = { id: 1, name: 'Bonus' };
      vi.mocked(mockRepository.create).mockResolvedValue(created);

      const result = await service.create('Bonus');

      expect(result).toEqual(created);
      expect(mockRepository.create).toHaveBeenCalledWith({ name: 'Bonus' });
    });

    it('should trim leading and trailing whitespace from the name', async () => {
      vi.mocked(mockRepository.create).mockResolvedValue({
        id: 1,
        name: 'Rental',
      });

      await service.create('  Rental  ');

      expect(mockRepository.create).toHaveBeenCalledWith({ name: 'Rental' });
    });

    it('should throw ValidationError when the name is empty', async () => {
      await expect(service.create('')).rejects.toMatchObject({
        message: 'The income category name is required',
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when the name is only whitespace', async () => {
      await expect(service.create('   ')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError when the name is undefined', async () => {
      await expect(
        service.create(undefined as unknown as string),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('update', () => {
    it('should update the category when id and name are valid', async () => {
      const existing = { id: 1, name: 'Old name' };
      const updated = { id: 1, name: 'New name' };
      vi.mocked(mockRepository.findById).mockResolvedValue(existing);
      vi.mocked(mockRepository.update).mockResolvedValue(updated);

      const result = await service.update(1, 'New name');

      expect(result).toEqual(updated);
      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        name: 'New name',
      });
    });

    it('should trim whitespace from the name before updating', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue({
        id: 1,
        name: 'Old',
      });
      vi.mocked(mockRepository.update).mockResolvedValue({
        id: 1,
        name: 'New',
      });

      await service.update(1, '  New  ');

      expect(mockRepository.update).toHaveBeenCalledWith(1, { name: 'New' });
    });

    it('should throw ValidationError when the id is invalid', async () => {
      await expect(service.update('abc', 'Valid name')).rejects.toMatchObject({
        message:
          'The income category id is required and must be a valid number',
      });
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when the name is empty', async () => {
      await expect(service.update(1, '')).rejects.toMatchObject({
        message: 'The income category name is required',
      });
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when the name is only whitespace', async () => {
      await expect(service.update(1, '   ')).rejects.toThrow(ValidationError);
    });

    it('should throw EntityNotFound when the category does not exist', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(service.update(999, 'Valid name')).rejects.toMatchObject({
        message: "The income category passed on the id wasn't found",
      });
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete the category and return true', async () => {
      vi.mocked(mockRepository.delete).mockResolvedValue(undefined);

      const result = await service.delete(1);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should convert a string id to number before deleting', async () => {
      vi.mocked(mockRepository.delete).mockResolvedValue(undefined);

      await service.delete('5');

      expect(mockRepository.delete).toHaveBeenCalledWith(5);
    });

    it('should throw ValidationError when the id is invalid', async () => {
      await expect(service.delete('abc')).rejects.toMatchObject({
        message:
          'The income category id is required and must be a valid number',
      });
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when the id is zero', async () => {
      await expect(service.delete(0)).rejects.toThrow(ValidationError);
    });
  });
});
