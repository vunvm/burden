import Joi from "joi";
import { USERNAME_REGEX, PASSWORD_REGEX } from "../_utils/regex_validation.js";

const createUserSchema = Joi.object({
    username: Joi.string().required().pattern(USERNAME_REGEX),
    password: Joi.string().required().pattern(PASSWORD_REGEX),
    centreName: Joi.string().required(),
    address: Joi.string().required(),
    centreType: Joi.string().required().valid("VRA", "VIC"),
});

const updateUserSchema = Joi.object({
    password: Joi.string().pattern(PASSWORD_REGEX),
    centreName: Joi.string(),
    address: Joi.string(),
    centreType: Joi.string().valid("VRA", "VIC"),
});

const loginSchema = Joi.object({
    username: Joi.string().required().pattern(USERNAME_REGEX),
    password: Joi.string().required().pattern(PASSWORD_REGEX),
});

export { createUserSchema, updateUserSchema, loginSchema };
