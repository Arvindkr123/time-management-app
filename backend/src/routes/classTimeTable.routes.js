import { Router } from "express";
import {
  addClassTimeTableController,
  getAddClassTimeTableControllers,
  deleteSingleClassTimeTableController,
} from "../controllers/class-time.table.controllers.js";
const router = Router();

router.get("/get", getAddClassTimeTableControllers);
router.delete("/delete/:p1/:ch1", deleteSingleClassTimeTableController);
router.post("/", addClassTimeTableController);

export default router;
