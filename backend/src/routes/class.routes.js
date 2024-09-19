import { Router } from "express";
import {
  addTimeTableClassController,
  getAllTimeTableClassController,
} from "../controllers/class.controllers.js";

const router = Router();

router
  .route("/")
  .post(addTimeTableClassController)
  .get(getAllTimeTableClassController);
export default router;
