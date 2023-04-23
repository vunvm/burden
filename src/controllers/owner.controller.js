import {
    addOwner,
    getOwnerDetail,
    getListOwners,
    updateOwner,
    deleteOwner,
} from "../services/owner.service.js";
import httpStatus from "http-status";
import config from "../config/index.js";

const addOwnerController = async (req, res, next) => {
    try {
        const createdOwnerId = await addOwner(req.body);
        return res.status(httpStatus.CREATED).json(createdOwnerId);
    } catch (error) {
        next(error);
    }
};

const updateOwnerController = async (req, res, next) => {
    try {
        const updatedOwnerId = await updateOwner(req.params.id, req.body);
        return res.status(httpStatus.OK).json(updatedOwnerId);
    } catch (error) {
        next(error);
    }
};

const getOwnerDetailController = async (req, res, next) => {
    try {
        const Owner = await getOwnerDetail(req.params.id);
        return res.status(httpStatus.OK).json(Owner);
    } catch (error) {
        next(error);
    }
};

const getListOwnersController = async (req, res, next) => {
    try {
        let pageIndex = parseInt(req.query.pageIndex);
        let pageSize = parseInt(req.query.pageSize);
        if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
            pageIndex = config.default_index_pagination;
            pageSize = config.default_size_pagination;
        }

        const Owners = await getListOwners(pageIndex, pageSize);
        return res.status(httpStatus.OK).json(Owners);
    } catch (error) {
        next(error);
    }
};

const deleteOwnerController = async (req, res, next) => {
    try {
        const OwnerId = await deleteOwner(req.params.id);
        return res.status(httpStatus.OK).json(OwnerId);
    } catch (error) {
        next(error);
    }
};

export {
    addOwnerController,
    getOwnerDetailController,
    getListOwnersController,
    updateOwnerController,
    deleteOwnerController,
};
