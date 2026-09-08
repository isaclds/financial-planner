import { Request, Response } from "express";
import { ExpenseCategoryService } from "../services/index";
import logger from "../config/logger";

export class ExpenseCategoryController {
  private service: ExpenseCategoryService;

  constructor() {
    this.service = new ExpenseCategoryService();
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    // melhorar esse tratamento de erro
    try {
      const categories = await this.service.findAll();
      console.log(categories);
      return res.status(200).json({
        success: true,
        data: categories,
        count: categories?.length,
      });
    } catch (error) {
      const errorMessage = "Error fetching expense categories";
      logger.error(errorMessage, error);
      return res.status(500).json({
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
