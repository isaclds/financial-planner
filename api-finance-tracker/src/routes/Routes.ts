import { Router } from "express";
import IncomeRouter from "./income.route";
import ExpensesRouter from "./expenses.route";

class Routes {
  static define(router: Router): Router {
    router.use("/expenses", ExpensesRouter);
    router.use("/income", IncomeRouter);

    return router;
  }
}

export default Routes.define(Router());
