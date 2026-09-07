import { Router } from "express";
import IncomeRouter from "./income.routes";
import ExpensesRouter from "./expenses.routes";

class Routes {
  static define(router: Router): Router {
    router.use("/expenses", ExpensesRouter);
    router.use("/income", IncomeRouter);

    return router;
  }
}

export default Routes.define(Router());
