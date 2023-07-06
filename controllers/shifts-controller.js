import {
	addEntryToDB,
	getAll,
	getById,
	updateById,
	deleteData,
} from "./controllers-utils.js";
import { ShiftSchema } from "../models/shiftSchema.js";

export const getAllShifts = (req, res) => {
	return getAll(res, ShiftSchema, {}, "", "shifts");
};
export const getShiftById = (req, res) => {
	const shiftId = req.params.id;
	return getById(res, ShiftSchema, shiftId, "Shift", "");
};
export const updateShiftById = (req, res) => {
	const shiftId = req.params.id;
	const newShiftData = req.body;
	return updateById(res, ShiftSchema, shiftId, newShiftData, "shift");
};

export const deleteShift = (req, res) => {
	const shiftId = req.params.id;
	return deleteData(res, ShiftSchema, shiftId, "Shift");
};

export const addShift = (req, res) => {
	const shift = req.data;
	return addEntryToDB(res, shift, "shifts");
};
