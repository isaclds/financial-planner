import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    _id: "ABC123",
    name: "Product Name",
    price: 28.9,
  });
});

export default router;
