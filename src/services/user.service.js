import jwt from "jsonwebtoken";
import config from "../config/index.js";
import APIError from "../helper/apiError.js";
import httpStatus from "http-status";
import sequelize from "../models/index.js";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";

const { User, Car, Inspection, Owner } = sequelize.models;

const login = async (payload) => {
    const user = await User.findOne({ where: { isDeleted: false, username: payload.username } });
    if (!user) {
        throw new APIError({ message: "Username doesn't exist !", status: httpStatus.NOT_FOUND });
    }

    if (user.password !== payload.password) {
        throw new APIError({ message: "Incorrect password !", status: httpStatus.UNAUTHORIZED });
    }

    const jwtToken = jwt.sign({ id: user.id }, config.token_secret, {
        expiresIn: config.token_expiry,
    });
    return new ApiDataResponse(httpStatus.OK, "login success", { token: jwtToken });
};

const addUser = async (payload) => {
    const existingUser = await User.findOne({
        where: { isDeleted: false, username: payload.username },
    });
    if (existingUser) {
        throw new APIError({ message: "User already exist !", status: httpStatus.CONFLICT });
    }

    const newUser = await User.create(payload);
    delete newUser.dataValues.password;

    return new ApiDataResponse(httpStatus.CREATED, "create success", newUser);
};

const getUserDetail = async (userId) => {
    const user = await User.findOne({
        where: { isDeleted: false, id: userId },
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        throw new APIError({ message: "User not found !", status: httpStatus.NOT_FOUND });
    }

    return user;
};

const getCentreInformation = async (centreId) => {
    const data = await Inspection.findAll({
        where: {
            isDeleted: false,
            UserId: centreId,
        },
        include: [{ model: Car, include: [Owner] }],
    });

    const inspectionsSet = new Set();
    const carsSet = new Set();
    const ownersSet = new Set();

    data.forEach((certificate) => {
        // Add inspection to inspections array
        inspectionsSet.add(
            JSON.stringify({
                id: certificate.id,
                certificate: certificate.certificate,
                expirationDate: certificate.expirationDate,
                isDeleted: certificate.isDeleted,
                createdAt: certificate.createdAt,
                updatedAt: certificate.updatedAt,
                carId: certificate.Car.id,
                userId: centreId,
            })
        );

        // Add car to cars array
        carsSet.add(
            JSON.stringify({
                id: certificate.Car.id,
                number: certificate.Car.number,
                registryCity: certificate.Car.registryCity,
                automaker: certificate.Car.automaker,
                model: certificate.Car.model,
                engineType: certificate.Car.engineType,
                fuelType: certificate.Car.fuelType,
                purpose: certificate.Car.purpose,
                isDeleted: certificate.Car.isDeleted,
                createdAt: certificate.Car.createdAt,
                updatedAt: certificate.Car.updatedAt,
            })
        );

        // Add owner to owners array
        ownersSet.add(
            JSON.stringify({
                id: certificate.Car.Owner.id,
                type: certificate.Car.Owner.type,
                name: certificate.Car.Owner.name,
                address: certificate.Car.Owner.address,
                isDeleted: certificate.Car.Owner.isDeleted,
                createdAt: certificate.Car.Owner.createdAt,
                updatedAt: certificate.Car.Owner.updatedAt,
            })
        );
    });
    const owners = Array.from(ownersSet).map((ownerString) => JSON.parse(ownerString));
    const inspections = Array.from(inspectionsSet).map((ownerString) => JSON.parse(ownerString));
    const cars = Array.from(carsSet).map((ownerString) => JSON.parse(ownerString));
    // Output the result
    const result = {
        inspections,
        cars,
        owners,
    };

    return result;
};

const getRegionInformation = async (region) => {
    const data = await Inspection.findAll({
        where: {
            isDeleted: false,
        },
        include: [
            { model: Car, include: [Owner] },
            { model: User, where: { region } },
        ],
    });

    const inspectionsSet = new Set();
    const carsSet = new Set();
    const ownersSet = new Set();

    data.forEach((certificate) => {
        // Add inspection to inspections array
        inspectionsSet.add(
            JSON.stringify({
                id: certificate.id,
                certificate: certificate.certificate,
                expirationDate: certificate.expirationDate,
                isDeleted: certificate.isDeleted,
                createdAt: certificate.createdAt,
                updatedAt: certificate.updatedAt,
                carId: certificate.Car.id,
                userId: certificate.User.id,
            })
        );

        // Add car to cars array
        carsSet.add(
            JSON.stringify({
                id: certificate.Car.id,
                number: certificate.Car.number,
                registryCity: certificate.Car.registryCity,
                automaker: certificate.Car.automaker,
                model: certificate.Car.model,
                engineType: certificate.Car.engineType,
                fuelType: certificate.Car.fuelType,
                purpose: certificate.Car.purpose,
                isDeleted: certificate.Car.isDeleted,
                createdAt: certificate.Car.createdAt,
                updatedAt: certificate.Car.updatedAt,
            })
        );

        // Add owner to owners array
        ownersSet.add(
            JSON.stringify({
                id: certificate.Car.Owner.id,
                type: certificate.Car.Owner.type,
                name: certificate.Car.Owner.name,
                address: certificate.Car.Owner.address,
                isDeleted: certificate.Car.Owner.isDeleted,
                createdAt: certificate.Car.Owner.createdAt,
                updatedAt: certificate.Car.Owner.updatedAt,
            })
        );
    });
    const owners = Array.from(ownersSet).map((ownerString) => JSON.parse(ownerString));
    const inspections = Array.from(inspectionsSet).map((ownerString) => JSON.parse(ownerString));
    const cars = Array.from(carsSet).map((ownerString) => JSON.parse(ownerString));
    // Output the result
    const result = {
        inspections,
        cars,
        owners,
    };

    return result;
};

const getListUsers = async (pageIndex, pageSize) => {
    const users = await User.findAll({
        where: { isDeleted: false },
        attributes: { exclude: ["password"] },
    });

    const totalCount = users.length;
    if (!totalCount) {
        throw new APIError({ message: "Users not found !", status: httpStatus.NOT_FOUND });
    }

    const totalPages = Math.ceil(totalCount / pageSize);
    if (pageIndex > totalPages) {
        throw new APIError({ message: "Invalid page index", status: httpStatus.BAD_REQUEST });
    }

    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return new ApiPaginatedResponse(
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
        users.slice(startIndex, endIndex)
    );
};

const updateUser = async (userId, payload) => {
    const updatedUser = await User.update(payload, { where: { isDeleted: false, id: userId } });
    if (!updatedUser) {
        throw new APIError({ message: "User not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "update success", updatedUser);
};

const inactiveUser = async (userId) => {
    const inactivatedUser = await User.update(
        { isDeleted: true },
        { where: { isDeleted: false, id: userId } }
    );
    if (!inactivatedUser) {
        throw new APIError({ message: "User not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "inactive success", inactivatedUser);
};

export {
    login,
    addUser,
    getUserDetail,
    getListUsers,
    updateUser,
    inactiveUser,
    getCentreInformation,
    getRegionInformation,
};
