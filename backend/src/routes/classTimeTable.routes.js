import { Router } from "express";
import { addClassTimeTableController } from "../controllers/class-time.table.controllers.js";
const router = Router();

router.route("/").post(addClassTimeTableController);

export default router;
