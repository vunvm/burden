import express from "express";
import {
    addOwnerController,
    getOwnerDetailController,
    getListOwnersController,
    updateOwnerController,
    deleteOwnerController,
} from "../controllers/owner.controller.js";
import { authJWT } from "../middlewares/auth.middleware.js";

const ownerRouter = express.Router();

ownerRouter.get("/owners", getListOwnersController);
ownerRouter.get("/owners/:id", getOwnerDetailController);

ownerRouter.post("/owners", addOwnerController);

ownerRouter.put("/owners/:id", updateOwnerController);

ownerRouter.delete("/owners/:id", deleteOwnerController);

export default ownerRouter;
