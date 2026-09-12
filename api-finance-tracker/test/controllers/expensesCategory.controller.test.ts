import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExpenseCategoryController } from '../../src/controllers/index';
import { ExpenseCategoryService } from '../../src/services/index';
import { createSuccessBodyResponse } from '@src/utils/createResponseBody';
import { HttpStatus } from '@src/config/status';
import { handleError } from '@src/utils/handleError';

vi.mock('../config/logger', () => ({
  default: { info: vi.fn(), error: vi.fn() },
}));

vi.mock('@src/utils/handleError', () => ({
  handleError: vi.fn(),
}));

describe('ExpenseCategoryController', () => {
  let controller: ExpenseCategoryController;
  let findAllSpy: ReturnType<typeof vi.spyOn>;
  let findByIdSpy: ReturnType<typeof vi.spyOn>;
  let createSpy: ReturnType<typeof vi.spyOn>;
  let updateSpy: ReturnType<typeof vi.spyOn>;
  let deleteSpy: ReturnType<typeof vi.spyOn>;
  let mockReq: any;
  let mockRes: any;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new ExpenseCategoryController();

    findAllSpy = vi.spyOn(ExpenseCategoryService.prototype, 'findAll');
    findByIdSpy = vi.spyOn(ExpenseCategoryService.prototype, 'findById');
    createSpy = vi.spyOn(ExpenseCategoryService.prototype, 'create');
    updateSpy = vi.spyOn(ExpenseCategoryService.prototype, 'update');
    deleteSpy = vi.spyOn(ExpenseCategoryService.prototype, 'delete');

    mockReq = { params: {}, body: {} };
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockRes = { status: statusMock };
  });

  describe('findAll', () => {
    it('deve retornar 200 com a lista de categorias', async () => {
      const mockCategories = [{ id: 1, name: 'Alimentação' }];
      findAllSpy.mockResolvedValue(mockCategories as any);

      await controller.findAll(mockReq, mockRes);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Expense categories retrieved',
          mockCategories,
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

  describe('findById', () => {
    it('deve retornar 200 com a categoria encontrada', async () => {
      mockReq.params = { id: '1' };
      const mockCategory = { id: 1, name: 'Alimentação' };
      findByIdSpy.mockResolvedValue(mockCategory as any);

      await controller.findById(mockReq, mockRes);

      expect(findByIdSpy).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Expense category retrieved',
          mockCategory,
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

  describe('create', () => {
    it('deve retornar 201 com a categoria criada', async () => {
      mockReq.body = { name: 'Transporte' };
      const mockCreated = { id: 2, name: 'Transporte' };
      createSpy.mockResolvedValue(mockCreated as any);

      await controller.create(mockReq, mockRes);

      expect(createSpy).toHaveBeenCalledWith('Transporte');
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.CREATED,
          'Expense category created',
          mockCreated,
        ),
      );
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      mockReq.body = { name: 'Transporte' };
      const error = new Error('Duplicate name');
      createSpy.mockRejectedValue(error);

      await controller.create(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve retornar 200 com a categoria atualizada', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Alimentação Atualizada' };
      const mockUpdated = { id: 1, name: 'Alimentação Atualizada' };
      updateSpy.mockResolvedValue(mockUpdated as any);

      await controller.update(mockReq, mockRes);

      expect(updateSpy).toHaveBeenCalledWith(1, 'Alimentação Atualizada');
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Expense category updated',
          mockUpdated,
        ),
      );
    });

    it('deve chamar handleError quando o id for inválido', async () => {
      mockReq.params = { id: 'abc' };
      mockReq.body = { name: 'Alimentação Atualizada' };

      await controller.update(mockReq, mockRes);

      expect(updateSpy).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it('deve chamar handleError quando o service lançar erro', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Alimentação Atualizada' };
      const error = new Error('Category not found');
      updateSpy.mockRejectedValue(error);

      await controller.update(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deve retornar 200 com a categoria deletada', async () => {
      mockReq.params = { id: '1' };
      const mockDeleted = { id: 1, name: 'Alimentação' };
      deleteSpy.mockResolvedValue(mockDeleted as any);

      await controller.delete(mockReq, mockRes);

      expect(deleteSpy).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        createSuccessBodyResponse(
          HttpStatus.OK,
          'Expense category deleted',
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
      const error = new Error('Category not found');
      deleteSpy.mockRejectedValue(error);

      await controller.delete(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(error, mockRes);
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });
});
