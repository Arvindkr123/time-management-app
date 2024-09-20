import { Router } from "express";
import {
  addTimeTableSubjectController,
  deleteSingleSubjectTimeTableController,
  getAllTimeTableSubjectController,
  updateSingleSubjectTimeTableController,
  getAllSubjectsOfTimeTableDataController,
} from "../controllers/subject.controllers.js";

const router = Router();

router.get("/all-subjects", getAllSubjectsOfTimeTableDataController);

router
  .route("/")
  .post(addTimeTableSubjectController)
  .get(getAllTimeTableSubjectController);
router
  .route("/:id")
  .delete(deleteSingleSubjectTimeTableController)
  .put(updateSingleSubjectTimeTableController);
export default router;
