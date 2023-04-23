import express from "express";
import userRouter from "./user.route.js";
import carRouter from "./car.route.js";
import ownerRouter from "./owner.route.js";
import inspectionRouter from "./inspection.route.js";

const routers = express.Router();
routers.use(userRouter);
routers.use(carRouter);
routers.use(ownerRouter);
routers.use(inspectionRouter);

export default routers;
