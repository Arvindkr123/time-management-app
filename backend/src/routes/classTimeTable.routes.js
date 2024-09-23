import { Router } from "express";
import {
  addClassTimeTableController,
  getAddClassTimeTableControllers,
} from "../controllers/class-time.table.controllers.js";
const router = Router();

router.get("/get", getAddClassTimeTableControllers);
router.post("/", addClassTimeTableController);

export default router;
