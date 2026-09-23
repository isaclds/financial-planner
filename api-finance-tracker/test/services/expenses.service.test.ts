import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExpensesService } from '@src/services/Expenses.service';
import { ExpensesRepository } from '@src/repositories/index';
import { ValidationError } from '@src/errors/ValidationError';
import { EntityNotFound } from '@src/errors/EntityNotFound';
import { Expenses } from '@src/models/Expenses.model';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let mockRepository: ExpensesRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      createWithDate: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findByCategory: vi.fn(),
      findByDateRange: vi.fn(),
      getTotal: vi.fn(),
      getTotalByCategory: vi.fn(),
      getMonthlyTotal: vi.fn(),
    } as unknown as ExpensesRepository;

    service = new ExpensesService(mockRepository);
  });

  // ---------------------------------------------------------------
  // findAll
  // ---------------------------------------------------------------
  describe('findAll', () => {
    it('should return all expenses', async () => {
      const expenses = [{ id: 1, name: 'Rent', value: 1500, category_id: 1 }];
      vi.mocked(mockRepository.findAll).mockResolvedValue(
        expenses as Expenses[],
      );

      const result = await service.findAll();

      expect(result).toEqual(expenses);
      expect(mockRepository.findAll).toHaveBeenCalledOnce();
    });

    it('should return an empty array when there are no expenses', async () => {
      vi.mocked(mockRepository.findAll).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('DB error');
      vi.mocked(mockRepository.findAll).mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow(error);
    });
  });

  // ---------------------------------------------------------------
  // findById
  // ---------------------------------------------------------------
  describe('findById', () => {
    it('should return the expense when the id is valid', async () => {
      const expense = { id: 1, name: 'Rent', value: 1500, category_id: 1 };
      vi.mocked(mockRepository.findById).mockResolvedValue(expense as Expenses);

      const result = await service.findById(1);

      expect(result).toEqual(expense);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should convert a string id to number before calling the repository', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue({
        id: 2,
        name: 'Water',
        value: 80,
        category_id: 1,
      } as Expenses);

      await service.findById('2');

      expect(mockRepository.findById).toHaveBeenCalledWith(2);
    });

    it('should throw ValidationError when the id is not a valid number', async () => {
      await expect(service.findById('abc')).rejects.toMatchObject({
        message: 'The expenses id is required and must be a valid number',
      });
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when the id is empty', async () => {
      await expect(service.findById('')).rejects.toThrow(ValidationError);
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when the id is zero', async () => {
      await expect(service.findById(0)).rejects.toThrow(ValidationError);
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when the id is negative', async () => {
      await expect(service.findById(-1)).rejects.toThrow(ValidationError);
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should return null when the expense is not found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  // ---------------------------------------------------------------
  // create
  // ---------------------------------------------------------------
  describe('create', () => {
    const validData = {
      name: 'Rent',
      value: 1500,
      category_id: 1,
    } as Omit<Expenses, 'id' | 'created_at'>;

    it('should create the expense with the given data', async () => {
      const created = { id: 1, ...validData } as Expenses;
      vi.mocked(mockRepository.create).mockResolvedValue(created);

      const result = await service.create(validData);

      expect(result).toEqual(created);
      expect(mockRepository.create).toHaveBeenCalledWith(validData);
    });

    it('should throw ValidationError when value is undefined', async () => {
      await expect(
        service.create({ ...validData, value: undefined as unknown as number }),
      ).rejects.toMatchObject({
        message: 'The expenses value is required',
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when value is null', async () => {
      await expect(
        service.create({ ...validData, value: null as unknown as number }),
      ).rejects.toThrow(ValidationError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when category_id is missing', async () => {
      await expect(
        service.create({
          ...validData,
          category_id: undefined as unknown as number,
        }),
      ).rejects.toMatchObject({
        message: 'The expenses category_id is required',
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when category_id is zero', async () => {
      await expect(
        service.create({ ...validData, category_id: 0 }),
      ).rejects.toThrow(ValidationError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // createWithDate
  // ---------------------------------------------------------------
  describe('createWithDate', () => {
    const dataWithDate = {
      name: 'Rent',
      value: 1500,
      category_id: 1,
      created_at: new Date('2024-01-15'),
    } as Omit<Expenses, 'id'>;

    it('should create the expense with a custom date', async () => {
      const created = { id: 1, ...dataWithDate } as Expenses;
      vi.mocked(mockRepository.createWithDate).mockResolvedValue(created);

      const result = await service.createWithDate(dataWithDate);

      expect(result).toEqual(created);
      expect(mockRepository.createWithDate).toHaveBeenCalledWith(dataWithDate);
    });

    it('should throw ValidationError when value is missing', async () => {
      await expect(
        service.createWithDate({
          ...dataWithDate,
          value: undefined as unknown as number,
        }),
      ).rejects.toThrow(ValidationError);
      expect(mockRepository.createWithDate).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when category_id is missing', async () => {
      await expect(
        service.createWithDate({
          ...dataWithDate,
          category_id: undefined as unknown as number,
        }),
      ).rejects.toThrow(ValidationError);
      expect(mockRepository.createWithDate).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // update
  // ---------------------------------------------------------------
  describe('update', () => {
    const existing = {
      id: 1,
      name: 'Rent',
      value: 1500,
      category_id: 1,
    } as Expenses;

    it('should update the expense when id and data are valid', async () => {
      const updated = { ...existing, value: 1600 };
      vi.mocked(mockRepository.findById).mockResolvedValue(existing);
      vi.mocked(mockRepository.update).mockResolvedValue(updated);

      const result = await service.update(1, { value: 1600 });

      expect(result).toEqual(updated);
      expect(mockRepository.update).toHaveBeenCalledWith(1, { value: 1600 });
    });

    it('should allow partial updates', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(existing);
      vi.mocked(mockRepository.update).mockResolvedValue({
        ...existing,
        name: 'New name',
      });

      await service.update(1, { name: 'New name' });

      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        name: 'New name',
      });
    });

    it('should throw ValidationError when the id is invalid', async () => {
      await expect(service.update('abc', { value: 100 })).rejects.toMatchObject(
        {
          message: 'The expenses id is required and must be a valid number',
        },
      );
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when the id is zero', async () => {
      await expect(service.update(0, { value: 100 })).rejects.toThrow(
        ValidationError,
      );
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw EntityNotFound when the expense does not exist', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(service.update(999, { value: 100 })).rejects.toMatchObject({
        message: "The expenses passed on the id wasn't found",
      });
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should propagate repository errors on update', async () => {
      const error = new Error('DB error');
      vi.mocked(mockRepository.findById).mockResolvedValue(existing);
      vi.mocked(mockRepository.update).mockRejectedValue(error);

      await expect(service.update(1, { value: 100 })).rejects.toThrow(error);
    });
  });

  // ---------------------------------------------------------------
  // delete
  // ---------------------------------------------------------------
  describe('delete', () => {
    it('should delete the expense and return true', async () => {
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
        message: 'The expenses id is required and must be a valid number',
      });
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when the id is zero', async () => {
      await expect(service.delete(0)).rejects.toThrow(ValidationError);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when the id is negative', async () => {
      await expect(service.delete(-5)).rejects.toThrow(ValidationError);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // findByCategory
  // ---------------------------------------------------------------
  describe('findByCategory', () => {
    it('should return expenses for the given category', async () => {
      const expenses = [
        { id: 1, name: 'Rent', value: 1500, category_id: 2 },
      ] as Expenses[];
      vi.mocked(mockRepository.findByCategory).mockResolvedValue(expenses);

      const result = await service.findByCategory(2);

      expect(result).toEqual(expenses);
      expect(mockRepository.findByCategory).toHaveBeenCalledWith(2);
    });

    it('should convert a string category id to number', async () => {
      vi.mocked(mockRepository.findByCategory).mockResolvedValue([]);

      await service.findByCategory(Number('3'));

      expect(mockRepository.findByCategory).toHaveBeenCalledWith(3);
    });

    it('should throw ValidationError when the category id is invalid', async () => {
      await expect(service.findByCategory(0)).rejects.toThrow(ValidationError);
      expect(mockRepository.findByCategory).not.toHaveBeenCalled();
    });

    it('should return an empty array when there are no expenses for the category', async () => {
      vi.mocked(mockRepository.findByCategory).mockResolvedValue([]);

      const result = await service.findByCategory(99);

      expect(result).toEqual([]);
    });
  });

  // ---------------------------------------------------------------
  // findByDateRange
  // ---------------------------------------------------------------
  describe('findByDateRange', () => {
    it('should return expenses within the date range', async () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const expenses = [
        { id: 1, name: 'Rent', value: 1500, category_id: 1 },
      ] as Expenses[];
      vi.mocked(mockRepository.findByDateRange).mockResolvedValue(expenses);

      const result = await service.findByDateRange(start, end);

      expect(result).toEqual(expenses);
      expect(mockRepository.findByDateRange).toHaveBeenCalledWith(start, end);
    });

    it('should return an empty array when there are no expenses in the range', async () => {
      vi.mocked(mockRepository.findByDateRange).mockResolvedValue([]);

      const result = await service.findByDateRange(
        new Date('2024-01-01'),
        new Date('2024-01-31'),
      );

      expect(result).toEqual([]);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('DB error');
      vi.mocked(mockRepository.findByDateRange).mockRejectedValue(error);

      await expect(
        service.findByDateRange(new Date(), new Date()),
      ).rejects.toThrow(error);
    });
  });

  // ---------------------------------------------------------------
  // getTotal
  // ---------------------------------------------------------------
  describe('getTotal', () => {
    it('should return the total of all expenses', async () => {
      vi.mocked(mockRepository.getTotal).mockResolvedValue({ total: 5000 });

      const result = await service.getTotal();

      expect(result).toEqual({ total: 5000 });
      expect(mockRepository.getTotal).toHaveBeenCalledOnce();
    });

    it('should return zero when there are no expenses', async () => {
      vi.mocked(mockRepository.getTotal).mockResolvedValue({ total: 0 });

      const result = await service.getTotal();

      expect(result).toEqual({ total: 0 });
    });
  });

  // ---------------------------------------------------------------
  // getTotalByCategory
  // ---------------------------------------------------------------
  describe('getTotalByCategory', () => {
    it('should return totals grouped by category', async () => {
      const totals = [
        { category_id: 1, total: 3000 },
        { category_id: 2, total: 2000 },
      ];
      vi.mocked(mockRepository.getTotalByCategory).mockResolvedValue(totals);

      const result = await service.getTotalByCategory();

      expect(result).toEqual(totals);
      expect(mockRepository.getTotalByCategory).toHaveBeenCalledOnce();
    });

    it('should return an empty array when there are no expenses', async () => {
      vi.mocked(mockRepository.getTotalByCategory).mockResolvedValue([]);

      const result = await service.getTotalByCategory();

      expect(result).toEqual([]);
    });
  });

  // ---------------------------------------------------------------
  // getMonthlyTotal
  // ---------------------------------------------------------------
  describe('getMonthlyTotal', () => {
    it('should return the total for the given month and year', async () => {
      vi.mocked(mockRepository.getMonthlyTotal).mockResolvedValue({
        total: 4200,
      });

      const result = await service.getMonthlyTotal(2024, 1);

      expect(result).toEqual({ total: 4200 });
      expect(mockRepository.getMonthlyTotal).toHaveBeenCalledWith(2024, 1);
    });

    it('should throw ValidationError when the month is less than 1', async () => {
      await expect(service.getMonthlyTotal(2024, 0)).rejects.toThrow(
        ValidationError,
      );
      expect(mockRepository.getMonthlyTotal).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when the month is greater than 12', async () => {
      await expect(service.getMonthlyTotal(2024, 13)).rejects.toThrow(
        ValidationError,
      );
      expect(mockRepository.getMonthlyTotal).not.toHaveBeenCalled();
    });

    it('should accept month boundaries 1 and 12', async () => {
      vi.mocked(mockRepository.getMonthlyTotal).mockResolvedValue({
        total: 100,
      });

      await expect(service.getMonthlyTotal(2024, 1)).resolves.toEqual({
        total: 100,
      });
      await expect(service.getMonthlyTotal(2024, 12)).resolves.toEqual({
        total: 100,
      });
    });
  });
});
