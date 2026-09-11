import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExpenseCategoryController } from '../../src/controllers/index';
import { ExpenseCategoryService } from '../../src/services/index';
import createBodyResponse from '@src/utils/createResponseBody';
import { HttpStatus } from '@src/config/status';

vi.mock('../config/logger', () => ({
  default: { error: vi.fn() },
}));

describe('ExpenseCategoryController', () => {
  let controller: ExpenseCategoryController;
  let findAllSpy: ReturnType<typeof vi.spyOn>;
  let mockReq: any;
  let mockRes: any;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new ExpenseCategoryController();

    findAllSpy = vi.spyOn(ExpenseCategoryService.prototype, 'findAll');

    mockReq = {};
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
        createBodyResponse(
          true,
          HttpStatus.OK,
          'All expenses categories retrieved',
          mockCategories,
        ),
      );
    });

    it('deve retornar 500 quando o service lançar erro generico', async () => {
      const error = new Error('Database connection failed');
      findAllSpy.mockRejectedValue(error);

      await controller.findAll(mockReq, mockRes);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(jsonMock).toHaveBeenCalledWith(
        createBodyResponse(
          false,
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Error fetching expense categories',
          'Database connection failed',
        ),
      );
    });
  });

  describe('findById', () => {});

  describe('create', () => {
    it('should create expense with 201', async () => {
      await controller.create(mockReq, mockRes);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(jsonMock).toBeFalsy();
    });
  });

  describe('update', () => {});

  describe('delete', () => {});
});
