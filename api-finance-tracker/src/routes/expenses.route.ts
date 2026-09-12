import { Router } from 'express';
import { ExpenseCategoryController } from '../controllers/index';
import { HttpStatus } from '@src/config/status';

const router = Router();
const categoryController = new ExpenseCategoryController();

router.get('/categories', (req, res) => categoryController.findAll(req, res));
router.get('/categories/:id', (req, res) =>
  categoryController.findById(req, res),
);
router.post('/categories', (req, res) => categoryController.create(req, res));
router.put('/categories/:id', (req, res) =>
  categoryController.update(req, res),
);
router.delete('/categories/:id', (req, res) =>
  categoryController.delete(req, res),
);

router.use((_req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({ error: 'Route not found' });
});

export default router;
