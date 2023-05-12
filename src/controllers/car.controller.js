import {
    addCar,
    getCarDetail,
    getListCars,
    updateCar,
    deleteCar,
} from "../services/car.service.js";
import { addOwner } from "../services/owner.service.js";
import { addInspection } from "../services/inspection.service.js";
import httpStatus from "http-status";
import config from "../config/index.js";
import XLSX from "xlsx";

const addCarController = async (req, res, next) => {
    try {
        const createdCarId = await addCar(req.body);
        return res.status(httpStatus.CREATED).json(createdCarId);
    } catch (error) {
        next(error);
    }
};

const uploadCarsController = async (req, res, next) => {
    try {
        const workbook = XLSX.read(req.file.buffer);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const dataTable = XLSX.utils.sheet_to_json(sheet);

        for (let column of dataTable) {
            const ownerRes = await addOwner({
                type: column.type,
                name: column.name,
                address: column.address,
            });
            const carRes = await addCar({
                number: column.number,
                registryCity: column.registryCity,
                automaker: column.automaker,
                model: column.model,
                engineType: column.engineType,
                fuelType: column.fuelType,
                purpose: column.purpose,
                OwnerId: ownerRes.data.id,
            });
            await addInspection({
                certificate: column.certificate,
                expirationDate: column.expirationDate,
                CarId: carRes.data.id,
                UserId: req.user.id,
            });
        }
        res.status(httpStatus.CREATED).json("OK");
    } catch (error) {
        next(error);
    }
};

const updateCarController = async (req, res, next) => {
    try {
        const updatedCarId = await updateCar(req.params.id, req.body);
        return res.status(httpStatus.OK).json(updatedCarId);
    } catch (error) {
        next(error);
    }
};

const getCarDetailController = async (req, res, next) => {
    try {
        const Car = await getCarDetail(req.params.number);
        return res.status(httpStatus.OK).json(Car);
    } catch (error) {
        next(error);
    }
};

const getListCarsController = async (req, res, next) => {
    try {
        let pageIndex = parseInt(req.query.pageIndex);
        let pageSize = parseInt(req.query.pageSize);
        if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
            pageIndex = config.default_index_pagination;
            pageSize = config.default_size_pagination;
        }

        const Cars = await getListCars(pageIndex, pageSize, req.query);
        return res.status(httpStatus.OK).json(Cars);
    } catch (error) {
        next(error);
    }
};

const deleteCarController = async (req, res, next) => {
    try {
        const CarId = await deleteCar(req.params.id);
        return res.status(httpStatus.OK).json(CarId);
    } catch (error) {
        next(error);
    }
};

export {
    addCarController,
    getCarDetailController,
    getListCarsController,
    updateCarController,
    deleteCarController,
    uploadCarsController,
};
