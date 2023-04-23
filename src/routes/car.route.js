import express from "express";
import {
    addCarController,
    getCarDetailController,
    getListCarsController,
    updateCarController,
    deleteCarController,
} from "../controllers/car.controller.js";
import { authJWT } from "../middlewares/auth.middleware.js";

const carRouter = express.Router();

carRouter.get("/cars", getListCarsController);
carRouter.get("/cars/:id", getCarDetailController);

carRouter.post("/cars", addCarController);

carRouter.put("/cars/:id", updateCarController);

carRouter.delete("/cars/:id", deleteCarController);

export default carRouter;
