import { Router } from "express";
import {
  addTimeTableTeacherController,
  deleteSingleTeacherTimeTableController,
  getAllTimeTableTeacherController,
  updateSingleTeacherTimeTableController,
  getAllTimeTableTeachersDataController,
} from "../controllers/teacher.controllers.js";

const router = Router();

router.get("/all-teachers", getAllTimeTableTeachersDataController);

router
  .route("/")
  .post(addTimeTableTeacherController)
  .get(getAllTimeTableTeacherController);
router
  .route("/:id")
  .delete(deleteSingleTeacherTimeTableController)
  .put(updateSingleTeacherTimeTableController);
export default router;
