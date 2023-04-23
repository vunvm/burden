import {
    addInspection,
    getInspectionDetail,
    getListInspections,
    updateInspection,
    deleteInspection,
} from "../services/inspection.service.js";
import httpStatus from "http-status";
import config from "../config/index.js";

const addInspectionController = async (req, res, next) => {
    try {
        const createdInspectionId = await addInspection(req.body);
        return res.status(httpStatus.CREATED).json(createdInspectionId);
    } catch (error) {
        next(error);
    }
};

const updateInspectionController = async (req, res, next) => {
    try {
        const updatedInspectionId = await updateInspection(req.params.id, req.body);
        return res.status(httpStatus.OK).json(updatedInspectionId);
    } catch (error) {
        next(error);
    }
};

const getInspectionDetailController = async (req, res, next) => {
    try {
        const Inspection = await getInspectionDetail(req.params.id);
        return res.status(httpStatus.OK).json(Inspection);
    } catch (error) {
        next(error);
    }
};

const getListInspectionsController = async (req, res, next) => {
    try {
        let pageIndex = parseInt(req.query.pageIndex);
        let pageSize = parseInt(req.query.pageSize);
        if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
            pageIndex = config.default_index_pagination;
            pageSize = config.default_size_pagination;
        }

        const Inspections = await getListInspections(
            req.query.from,
            req.query.to,
            pageIndex,
            pageSize,
            req.query.address,
            req.query.centreName
        );
        return res.status(httpStatus.OK).json(Inspections);
    } catch (error) {
        next(error);
    }
};

const deleteInspectionController = async (req, res, next) => {
    try {
        const InspectionId = await deleteInspection(req.params.id);
        return res.status(httpStatus.OK).json(InspectionId);
    } catch (error) {
        next(error);
    }
};

export {
    addInspectionController,
    getInspectionDetailController,
    getListInspectionsController,
    updateInspectionController,
    deleteInspectionController,
};
