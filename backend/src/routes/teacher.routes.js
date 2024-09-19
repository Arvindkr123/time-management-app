import { Router } from "express";
import {
  addTimeTableTeacherController,
  deleteSingleTeacherTimeTableController,
  getAllTimeTableTeacherController,
  updateSingleTeacherTimeTableController,
} from "../controllers/teacher.controllers.js";

const router = Router();

router
  .route("/")
  .post(addTimeTableTeacherController)
  .get(getAllTimeTableTeacherController);
router
  .route("/:id")
  .delete(deleteSingleTeacherTimeTableController)
  .put(updateSingleTeacherTimeTableController);
export default router;
