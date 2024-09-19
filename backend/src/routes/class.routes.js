import { Router } from "express";
import {
  addTimeTableClassController,
  getAllTimeTableClassController,
  deleteSingleClassTimeTableController,
  updateSingleClassTimeTableController,
} from "../controllers/class.controllers.js";

const router = Router();

router
  .route("/")
  .post(addTimeTableClassController)
  .get(getAllTimeTableClassController);
router
  .route("/:id")
  .delete(deleteSingleClassTimeTableController)
  .put(updateSingleClassTimeTableController);
export default router;
