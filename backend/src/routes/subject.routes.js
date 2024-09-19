import { Router } from "express";
import {
  addTimeTableSubjectController,
  deleteSingleSubjectTimeTableController,
  getAllTimeTableSubjectController,
  updateSingleSubjectTimeTableController,
} from "../controllers/subject.controllers.js";

const router = Router();

router
  .route("/")
  .post(addTimeTableSubjectController)
  .get(getAllTimeTableSubjectController);
router
  .route("/:id")
  .delete(deleteSingleSubjectTimeTableController)
  .put(updateSingleSubjectTimeTableController);
export default router;
