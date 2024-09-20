import { Router } from "express";
import {
  addTimeTableClassController,
  getAllTimeTableClassController,
  deleteSingleClassTimeTableController,
  updateSingleClassTimeTableController,
  getAllClassofTimeTableController,
} from "../controllers/class.controllers.js";

const router = Router();

router.get("/all-classes", getAllClassofTimeTableController);

router
  .route("/")
  .post(addTimeTableClassController)
  .get(getAllTimeTableClassController);
router
  .route("/:id")
  .delete(deleteSingleClassTimeTableController)
  .put(updateSingleClassTimeTableController);
export default router;
