import APIError from "../helper/apiError.js";
import httpStatus from "http-status";
import sequelize from "../models/index.js";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";

const { Owner } = sequelize.models;

const addOwner = async (payload) => {
    const newOwner = await Owner.create(payload);

    return new ApiDataResponse(httpStatus.CREATED, "create success", newOwner);
};

const getOwnerDetail = async (OwnerId) => {
    const owner = await Owner.findOne({
        where: { isDeleted: false, id: OwnerId },
    });

    if (!owner) {
        throw new APIError({ message: "Owner not found !", status: httpStatus.NOT_FOUND });
    }

    return owner;
};

const getListOwners = async (pageIndex, pageSize) => {
    const Owners = await Owner.findAll({
        where: { isDeleted: false },
    });

    const totalCount = Owners.length;
    if (!totalCount) {
        throw new APIError({ message: "Owners not found !", status: httpStatus.NOT_FOUND });
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
        Owners.slice(startIndex, endIndex)
    );
};

const updateOwner = async (OwnerId, payload) => {
    const updatedOwner = await Owner.update(payload, { where: { isDeleted: false, id: OwnerId } });
    if (!updatedOwner) {
        throw new APIError({ message: "Owner not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "update success", updatedOwner);
};

const deleteOwner = async (OwnerId) => {
    const inactivatedOwner = await Owner.update(
        { isDeleted: true },
        { where: { isDeleted: false, id: OwnerId } }
    );
    if (!inactivatedOwner) {
        throw new APIError({ message: "Owner not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "inactive success", inactivatedOwner);
};

export { addOwner, getOwnerDetail, getListOwners, updateOwner, deleteOwner };
