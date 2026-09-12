import { Router } from 'express';
import IncomeRouter from './income.route';
import ExpensesRouter from './expenses.route';
import swaggerUi from 'swagger-ui-express';
import { getOpenApiSpec } from '@src/docs/swagger';

class Routes {
  static define(router: Router): Router {
    router.use('/expenses', ExpensesRouter);
    router.use('/income', IncomeRouter);
    router.use('/docs', swaggerUi.serve, swaggerUi.setup(getOpenApiSpec()));
    router.get('/docs.json', (_req, res) => res.json(getOpenApiSpec()));

    return router;
  }
}

export default Routes.define(Router());
