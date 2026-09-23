import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExpensesController } from '../../src/controllers/index';
import { ExpensesService } from '../../src/services/index';
import { createSuccessBodyResponse } from '@src/utils/createResponseBody';
import { HttpStatus } from '@src/config/status';
import { handleError } from '@src/utils/handleError';

vi.mock('../config/logger', () => ({
  default: { info: vi.fn(), error: vi.fn() },
}));

vi.mock('@src/utils/handleError', () => ({
  handleError: vi.fn(),
}));

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let findAllSpy: ReturnType<typeof vi.spyOn>;
  let findByIdSpy: ReturnType<typeof vi.spyOn>;
  let createSpy: ReturnType<typeof vi.spyOn>;
  let createWithDateSpy: ReturnType<typeof vi.spyOn>;
  let updateSpy: ReturnType<typeof vi.spyOn>;
  let deleteSpy: ReturnType<typeof vi.spyOn>;
  let findByCategorySpy: ReturnType<typeof vi.spyOn>;
  let findByDateRangeSpy: ReturnType<typeof vi.spyOn>;
  let getTotalSpy: ReturnType<typeof vi.spyOn>;
  let getTotalByCategorySpy: ReturnType<typeof vi.spyOn>;
  let getMonthlyTotalSpy: ReturnType<typeof vi.spyOn>;

  let mockReq: any;
  let mockRes: any;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new ExpensesController();

    findAllSpy = vi.spyOn(ExpensesService.prototype, 'findAll');
    findByIdSpy = vi.spyOn(ExpensesService.prototype, 'findById');
    createSpy = vi.spyOn(ExpensesService.prototype, 'create');
    createWithDateSpy = vi.spyOn(ExpensesService.prototype, 'createWithDate');
    updateSpy = vi.spyOn(ExpensesService.prototype, 'update');
    deleteSpy = vi.spyOn(ExpensesService.prototype, 'delete');
    findByCategorySpy = vi.spyOn(ExpensesService.prototype, 'findByCategory');
    findByDateRangeSpy = vi.spyOn(ExpensesService.prototype, 'findByDateRange');
    getTotalSpy = vi.spyOn(ExpensesService.prototype, 'getTotal');
    getTotalByCategorySpy = vi.spyOn(
      ExpensesService.prototype,
      'getTotalByCategory',
    );
    getMonthlyTotalSpy = vi.spyOn(ExpensesService.prototype, 'getMonthlyTotal');

    mockReq = { params: {}, body: {}, query: {} };
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockRes = { status: statusMock };
  });

  // ---------------------------------------------------------------
  // findAll
  // ---------------------------------------------------------------
  describe('findAll', () => {
    it('deve retornar 200 com a lista de despesas', async () => {
      const mockExpenses = [
        { id: 1, name: 'Aluguel', value: 1500, category_id: 1 },
      ];
      findAllSpy.mockResolvedValue(mockExpenses as any);

      await controller.findAll(mockReq, mockRes);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Expenses retrieved',
          mockExpenses,
        ),
      );
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      const error = new Error('Database connection failed');
      findAllSpy.mockRejectedValue(error);

      await controller.findAll(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // findById
  // ---------------------------------------------------------------
  describe('findById', () => {
    it('deve retornar 200 com a despesa encontrada', async () => {
      mockReq.params = { id: '1' };
      const mockExpense = { id: 1, name: 'Aluguel', value: 1500 };
      findByIdSpy.mockResolvedValue(mockExpense as any);

      await controller.findById(mockReq, mockRes);

      expect(findByIdSpy).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Expense retrieved',
          mockExpense,
        ),
      );
    });

    it('deve chamar handleError quando o id for inválido', async () => {
      mockReq.params = { id: 'abc' };

      await controller.findById(mockReq, mockRes);

      expect(findByIdSpy).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      mockReq.params = { id: '1' };
      const error = new Error('Not found');
      findByIdSpy.mockRejectedValue(error);

      await controller.findById(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // create
  // ---------------------------------------------------------------
  describe('create', () => {
    it('deve retornar 201 com a despesa criada', async () => {
      mockReq.body = { name: 'Aluguel', value: 1500, category_id: 1 };
      const mockCreated = { id: 1, ...mockReq.body };
      createSpy.mockResolvedValue(mockCreated as any);

      await controller.create(mockReq, mockRes);

      expect(createSpy).toHaveBeenCalledWith(mockReq.body);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.CREATED,
          'Expense created',
          mockCreated,
        ),
      );
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      mockReq.body = { name: 'Aluguel', value: 1500, category_id: 1 };
      const error = new Error('Validation failed');
      createSpy.mockRejectedValue(error);

      await controller.create(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // createWithDate
  // ---------------------------------------------------------------
  describe('createWithDate', () => {
    it('deve retornar 201 com a despesa criada com data', async () => {
      mockReq.body = {
        name: 'Aluguel',
        value: 1500,
        category_id: 1,
        created_at: new Date('2024-01-15'),
      };
      const mockCreated = { id: 1, ...mockReq.body };
      createWithDateSpy.mockResolvedValue(mockCreated as any);

      await controller.createWithDate(mockReq, mockRes);

      expect(createWithDateSpy).toHaveBeenCalledWith(mockReq.body);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.CREATED,
          'Expense created',
          mockCreated,
        ),
      );
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      mockReq.body = {
        name: 'Aluguel',
        value: 1500,
        category_id: 1,
        created_at: new Date('2024-01-15'),
      };
      const error = new Error('Invalid date');
      createWithDateSpy.mockRejectedValue(error);

      await controller.createWithDate(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // update
  // ---------------------------------------------------------------
  describe('update', () => {
    it('deve retornar 200 com a despesa atualizada', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { value: 1600 };
      const mockUpdated = { id: 1, name: 'Aluguel', value: 1600 };
      updateSpy.mockResolvedValue(mockUpdated as any);

      await controller.update(mockReq, mockRes);

      expect(updateSpy).toHaveBeenCalledWith(1, { value: 1600 });
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Expense updated',
          mockUpdated,
        ),
      );
    });

    it('deve chamar handleError quando o id for inválido', async () => {
      mockReq.params = { id: 'abc' };
      mockReq.body = { value: 1600 };

      await controller.update(mockReq, mockRes);

      expect(updateSpy).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { value: 1600 };
      const error = new Error('Expense not found');
      updateSpy.mockRejectedValue(error);

      await controller.update(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // delete
  // ---------------------------------------------------------------
  describe('delete', () => {
    it('deve retornar 200 com a despesa deletada', async () => {
      mockReq.params = { id: '1' };
      const mockDeleted = true;
      deleteSpy.mockResolvedValue(mockDeleted as any);

      await controller.delete(mockReq, mockRes);

      expect(deleteSpy).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Expense deleted',
          mockDeleted,
        ),
      );
    });

    it('deve chamar handleError quando o id for inválido', async () => {
      mockReq.params = { id: 'abc' };

      await controller.delete(mockReq, mockRes);

      expect(deleteSpy).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      mockReq.params = { id: '1' };
      const error = new Error('Expense not found');
      deleteSpy.mockRejectedValue(error);

      await controller.delete(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // findByCategory
  // ---------------------------------------------------------------
  describe('findByCategory', () => {
    it('deve retornar 200 com as despesas da categoria', async () => {
      mockReq.params = { categoryId: '2' };
      const mockExpenses = [
        { id: 1, name: 'Aluguel', value: 1500, category_id: 2 },
      ];
      findByCategorySpy.mockResolvedValue(mockExpenses as any);

      await controller.findByCategory(mockReq, mockRes);

      expect(findByCategorySpy).toHaveBeenCalledWith(2);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Expenses retrieved',
          mockExpenses,
        ),
      );
    });

    it('deve chamar handleError quando o categoryId for inválido', async () => {
      mockReq.params = { categoryId: 'abc' };

      await controller.findByCategory(mockReq, mockRes);

      expect(findByCategorySpy).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      mockReq.params = { categoryId: '2' };
      const error = new Error('Database error');
      findByCategorySpy.mockRejectedValue(error);

      await controller.findByCategory(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // findByDateRange
  // ---------------------------------------------------------------
  describe('findByDateRange', () => {
    it('deve retornar 200 com as despesas do período', async () => {
      mockReq.query = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      const mockExpenses = [
        { id: 1, name: 'Aluguel', value: 1500, category_id: 1 },
      ];
      findByDateRangeSpy.mockResolvedValue(mockExpenses as any);

      await controller.findByDateRange(mockReq, mockRes);

      expect(findByDateRangeSpy).toHaveBeenCalledWith(
        new Date('2024-01-01'),
        new Date('2024-01-31'),
      );
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Expenses retrieved',
          mockExpenses,
        ),
      );
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      mockReq.query = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      const error = new Error('Invalid range');
      findByDateRangeSpy.mockRejectedValue(error);

      await controller.findByDateRange(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // getTotal
  // ---------------------------------------------------------------
  describe('getTotal', () => {
    it('deve retornar 200 com o total de despesas', async () => {
      const mockTotal = { total: 5000 };
      getTotalSpy.mockResolvedValue(mockTotal as any);

      await controller.getTotal(mockReq, mockRes);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Expenses total retrieved',
          mockTotal,
        ),
      );
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      const error = new Error('Database error');
      getTotalSpy.mockRejectedValue(error);

      await controller.getTotal(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // getTotalByCategory
  // ---------------------------------------------------------------
  describe('getTotalByCategory', () => {
    it('deve retornar 200 com os totais por categoria', async () => {
      const mockTotals = [
        { category_id: 1, total: 3000 },
        { category_id: 2, total: 2000 },
      ];
      getTotalByCategorySpy.mockResolvedValue(mockTotals as any);

      await controller.getTotalByCategory(mockReq, mockRes);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Expenses totals by category retrieved',
          mockTotals,
        ),
      );
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      const error = new Error('Database error');
      getTotalByCategorySpy.mockRejectedValue(error);

      await controller.getTotalByCategory(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // getMonthlyTotal
  // ---------------------------------------------------------------
  describe('getMonthlyTotal', () => {
    it('deve retornar 200 com o total mensal', async () => {
      mockReq.params = { year: '2024', month: '1' };
      const mockTotal = { total: 4200 };
      getMonthlyTotalSpy.mockResolvedValue(mockTotal as any);

      await controller.getMonthlyTotal(mockReq, mockRes);

      expect(getMonthlyTotalSpy).toHaveBeenCalledWith(2024, 1);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Monthly expenses total retrieved',
          mockTotal,
        ),
      );
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      mockReq.params = { year: '2024', month: '13' };
      const error = new Error('Invalid month');
      getMonthlyTotalSpy.mockRejectedValue(error);

      await controller.getMonthlyTotal(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });
});
