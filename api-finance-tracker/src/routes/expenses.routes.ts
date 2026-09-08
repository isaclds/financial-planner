import { Router } from "express";
import { ExpenseCategoryController } from "../controllers/index";

const router = Router();
const categoryController = new ExpenseCategoryController();

router.get("/", (req, res) => {
  res.json({
    _id: "ABC123",
    name: "Product Name",
    price: 28.9,
  });
});

router.get("/categories", (req, res) => categoryController.findAll(req, res));

export default router;
