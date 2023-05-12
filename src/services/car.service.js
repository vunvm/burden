import APIError from "../helper/apiError.js";
import httpStatus from "http-status";
import sequelize from "../models/index.js";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";

const { Car } = sequelize.models;

const addCar = async (payload) => {
    const newCar = await Car.create(payload);

    return new ApiDataResponse(httpStatus.CREATED, "create success", newCar);
};

const getCarDetail = async (carNumber) => {
    const car = await Car.findOne({
        where: { isDeleted: false, number: carNumber },
    });

    if (!car) {
        throw new APIError({ message: "Car not found !", status: httpStatus.NOT_FOUND });
    }

    return car;
};

const getListCars = async (pageIndex, pageSize, filter) => {
    const Cars = await Car.findAll({
        where: { ...filter, isDeleted: false },
    });

    const totalCount = Cars.length;
    if (!totalCount) {
        throw new APIError({ message: "Cars not found !", status: httpStatus.NOT_FOUND });
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
        Cars.slice(startIndex, endIndex)
    );
};

const updateCar = async (CarId, payload) => {
    const updatedCar = await Car.update(payload, { where: { isDeleted: false, id: CarId } });
    if (!updatedCar) {
        throw new APIError({ message: "Car not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "update success", updatedCar);
};

const deleteCar = async (CarId) => {
    const inactivatedCar = await Car.update(
        { isDeleted: true },
        { where: { isDeleted: false, id: CarId } }
    );
    if (!inactivatedCar) {
        throw new APIError({ message: "Car not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "inactive success", inactivatedCar);
};

export { addCar, getCarDetail, getListCars, updateCar, deleteCar };
