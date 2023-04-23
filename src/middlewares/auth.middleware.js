import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../config/index.js";
import sequelize from "../models/index.js";
import APIError from "../helper/apiError.js";

const { User } = sequelize.models;

const getToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.length > 0) {
        return req.headers.authorization.split(/\s+/)[1];
    }
};

const authJWT = async (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json("No token provided!");
    }

    jwt.verify(token, config.token_secret, async (error, decoded) => {
        if (error) {
            return res.status(httpStatus.UNAUTHORIZED).json("Failed to authenticate token!");
        }
        const id = decoded.id;
        const user = await User.findOne({
            where: { id },
        });

        req.user = user;

        return next();
    });
};

export { authJWT };
