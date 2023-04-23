import express from "express";
import {
    loginController,
    addUserController,
    getUserDetailController,
    getListUsersController,
    updateUserController,
    inactiveUserController,
} from "../controllers/user.controller.js";
import { authJWT } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/users", getListUsersController);
userRouter.get("/users/:id", getUserDetailController);

userRouter.post("/users/login", loginController);
userRouter.post("/users", addUserController);

userRouter.put("/users/:id", updateUserController);

userRouter.delete("/users/:id", inactiveUserController);

export default userRouter;
