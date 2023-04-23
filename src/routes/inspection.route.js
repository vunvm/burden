import express from "express";
import {
    addInspectionController,
    getInspectionDetailController,
    getListInspectionsController,
    updateInspectionController,
    deleteInspectionController,
} from "../controllers/inspection.controller.js";
import { authJWT } from "../middlewares/auth.middleware.js";

const inspectionRouter = express.Router();

inspectionRouter.get("/inspections", getListInspectionsController);
inspectionRouter.get("/inspections/:id", getInspectionDetailController);

inspectionRouter.post("/inspections", addInspectionController);

inspectionRouter.put("/inspections/:id", updateInspectionController);

inspectionRouter.delete("/inspections/:id", deleteInspectionController);

export default inspectionRouter;
