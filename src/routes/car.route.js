import express from "express";
import {
    addCarController,
    getCarDetailController,
    getListCarsController,
    updateCarController,
    deleteCarController,
    uploadCarsController,
} from "../controllers/car.controller.js";
import multer from "multer";
import { authJWT } from "../middlewares/auth.middleware.js";

const upload = multer();

const carRouter = express.Router();

carRouter.get("/cars", getListCarsController);
carRouter.get("/cars/:number", getCarDetailController);

carRouter.post("/cars/upload", authJWT, upload.single("file"), uploadCarsController);
carRouter.post("/cars", addCarController);

carRouter.put("/cars/:id", updateCarController);

carRouter.delete("/cars/:id", deleteCarController);

export default carRouter;
