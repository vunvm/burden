import express from "express";
import {
    addCarController,
    getCarDetailController,
    getListCarsController,
    updateCarController,
    deleteCarController,
    uploadCarsController,
} from "../controllers/car.controller.js";
import { authJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";
const upload = multer();

const carRouter = express.Router();

carRouter.get("/cars", getListCarsController);
carRouter.get("/cars/:id", getCarDetailController);

carRouter.post("/cars/upload", upload.single("file"), uploadCarsController);
carRouter.post("/cars", addCarController);

carRouter.put("/cars/:id", updateCarController);

carRouter.delete("/cars/:id", deleteCarController);

export default carRouter;
