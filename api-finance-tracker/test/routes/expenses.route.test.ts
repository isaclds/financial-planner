import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { SetupApplication } from '../../src/App';
import { ExpenseCategoryController } from '../../src/controllers/index';

describe('Expense routes', () => {
  let application: SetupApplication;

  beforeEach(() => {
    application = new SetupApplication();
    application.init();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.todo('should return expenses list with 200', async () => {
    const expectedExpenses = [{ id: '1', name: 'Groceries', value: 120.5 }];

    // (getExpenses as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    //   (req, res) => {
    //     res.status(200).send(expectedExpenses);
    //   },
    // );

    const response = await request(application.app).get('/expenses').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedExpenses);
  });

  describe('Categories routes', () => {
    it('should return all the expenses categories', async () => {
      const expectedCategories = [
        { id: 1, name: 'Bank Fees' },
        { id: 2, name: 'Food' },
      ];

      // Mock do controller diretamente
      const mockReq = {} as any;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as any;

      vi.spyOn(
        ExpenseCategoryController.prototype,
        'findAll',
      ).mockImplementation(async (req, res) => {
        return res.status(200).json({
          success: true,
          data: expectedCategories,
          count: expectedCategories.length,
        });
      });

      const response = await request(application.app)
        .get('/expenses/categories')
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expectedCategories,
        count: expectedCategories.length,
      });
    });
  });
});
