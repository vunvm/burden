import APIError from "../helper/apiError.js";
import httpStatus from "http-status";
import sequelize from "../models/index.js";
import { Op } from "sequelize";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";

const { Inspection, User } = sequelize.models;

const addInspection = async (payload) => {
    const newInspection = await Inspection.create(payload);

    return new ApiDataResponse(httpStatus.CREATED, "create success", newInspection);
};

const getInspectionDetail = async (InspectionId) => {
    const inspection = await Inspection.findOne({
        where: { isDeleted: false, id: InspectionId },
    });

    if (!inspection) {
        throw new APIError({ message: "Inspection not found !", status: httpStatus.NOT_FOUND });
    }

    return inspection;
};

const getListInspections = async (expired, from, to, pageIndex, pageSize, address, centreName) => {
    let inspections;

    if (expired) {
        inspections = await Inspection.findAll({
            where: { isDeleted: false, expirationDate: { [Op.gte]: from, [Op.lte]: to } },
            include: [User],
        });
    } else {
        inspections = await Inspection.findAll({
            where: { isDeleted: false, createdAt: { [Op.gte]: from, [Op.lte]: to } },
            include: [User],
        });
    }

    if (address) {
        inspections = inspections.filter((inspection) => inspection.address.contain(address));
    }

    if (centreName) {
        inspections = inspections.filter((inspection) => inspection.User.centreName === centreName);
    }

    const totalCount = inspections.length;
    if (!totalCount) {
        throw new APIError({ message: "inspections not found !", status: httpStatus.NOT_FOUND });
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
        inspections.slice(startIndex, endIndex)
    );
};

const updateInspection = async (InspectionId, payload) => {
    const updatedInspection = await Inspection.update(payload, {
        where: { isDeleted: false, id: InspectionId },
    });
    if (!updatedInspection) {
        throw new APIError({ message: "Inspection not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "update success", updatedInspection);
};

const deleteInspection = async (InspectionId) => {
    const inactivatedInspection = await Inspection.update(
        { isDeleted: true },
        { where: { isDeleted: false, id: InspectionId } }
    );
    if (!inactivatedInspection) {
        throw new APIError({ message: "Inspection not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "inactive success", inactivatedInspection);
};

export {
    addInspection,
    getInspectionDetail,
    getListInspections,
    updateInspection,
    deleteInspection,
};
