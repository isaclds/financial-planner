import request from "supertest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { SetupApplication } from "../../src/app";

vi.mock("../../controller/expenses");

afterEach(() => {
  vi.clearAllMocks();
});

describe("Expense routes", () => {
  const application = new SetupApplication(3000);
  application.init();

  it("should return expenses list with 200", async () => {
    const expectedExpenses = [{ id: "1", name: "Groceries", value: 120.5 }];

    (getExpenses as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (req, res) => {
        res.status(200).send(expectedExpenses);
      },
    );

    const response = await request(application.app).get("/expenses").send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedExpenses);
  });
});
