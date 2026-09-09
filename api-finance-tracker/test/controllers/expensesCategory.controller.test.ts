import { describe, it, expect, beforeEach, vi } from "vitest";
import { ExpenseCategoryController } from "../../src/controllers/index";
import { ExpenseCategoryService } from "../../src/services/index";

vi.mock("../config/logger", () => ({
  default: { error: vi.fn() },
}));

describe("ExpenseCategoryController", () => {
  let controller: ExpenseCategoryController;
  let findAllSpy: ReturnType<typeof vi.spyOn>;
  let mockReq: any;
  let mockRes: any;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new ExpenseCategoryController();

    findAllSpy = vi.spyOn(ExpenseCategoryService.prototype, "findAll");

    mockReq = {};
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockRes = { status: statusMock };
  });

  it("deve retornar 200 com a lista de categorias", async () => {
    const mockCategories = [{ id: 1, name: "Alimentação" }];
    findAllSpy.mockResolvedValue(mockCategories as any);

    await controller.findAll(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: mockCategories,
      count: mockCategories.length,
    });
  });

  it("deve retornar 500 quando o service lançar erro", async () => {
    const error = new Error("Database connection failed");
    findAllSpy.mockRejectedValue(error);

    await controller.findAll(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Error fetching expense categories",
      error: "Database connection failed",
    });
  });
});
