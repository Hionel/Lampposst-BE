import { UserSchema } from "../models/userSchema.js";
import { ShiftSchema } from "../models/shiftSchema.js";
import mongoose from "mongoose";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { sendResponse } from "../controllers/controllers-utils.js";
import { CommentSchema } from "../models/commentSchema.js";

export const validateUserRegistration = async (req, res, next) => {
	const registrationData = req.body;
	if (
		!registrationData.email ||
		!registrationData.firstname ||
		!registrationData.lastname ||
		!registrationData.password
	) {
		return sendResponse(
			res,
			412,
			"Precondition failed",
			"User data is missing fields!"
		);
	}

	const emailExists = await UserSchema.findOne({
		email: registrationData.email,
	});

	if (emailExists) {
		return sendResponse(res, 409, "Conflict", "Email already in use!");
	}
	next();
};

export const validateUpdate = async (req, res, next) => {
	const id = req.params.id;
	const newData = req.body;
	if (!id) {
		return sendResponse(res, 400, "Bad request", "Request has no ID!");
	}
	if (!newData || Object.keys(newData).length < 1) {
		return sendResponse(res, 400, "Bad request", "Request has no data!");
	}
	next();
};

export const validateLogin = async (req, res, next) => {
	const { email, password } = req.body;
	const user = await UserSchema.findOne({ email });
	if (!email || !password) {
		return sendResponse(res, 412, "Precondition failed", "Input missing!");
	}
	if (!user) {
		return sendResponse(res, 404, "Not found!", "User was not found!");
	}
	const comparePasswords = bcrypt.compareSync(password, user.password);
	if (!comparePasswords) {
		return sendResponse(res, 409, "Conflict!", "Passwords do NOT match!");
	}
	req.data = user;
	next();
};

export const validateAdminPermission = async (req, res, next) => {
	const secretKey = process.env.JWT_PASS;
	const token = jwt.verify(req.headers.accesstoken, secretKey);
	const { id, email, permission } = token;
	if (!id) {
		return sendResponse(res, 400, "Bad request", "Request has no ID!");
	}
	const dbUserData = await UserSchema.findById(id);
	if (
		permission !== "admin" ||
		permission !== dbUserData.permission ||
		email !== dbUserData.email ||
		dbUserData.permission !== "admin"
	) {
		return sendResponse(
			res,
			401,
			"Unauthorized",
			"Permission missing for this action!"
		);
	}
	next();
};

export const validateSignToken = (req, res, next) => {
	const token = req.headers.accesstoken;
	if (!token) {
		return sendResponse(res, 404, "Not found!", "User is not logged in!");
	}
	try {
		const secretKey = process.env.JWT_PASS;
		jwt.verify(token, secretKey);
		next();
	} catch (error) {
		return sendResponse(
			res,
			403,
			"Forbidden!",
			`Token ${error.message} at ${error.expiredAt}!`
		);
	}
};

export const validateShiftEntry = async (req, res, next) => {
	const userId = jwt.decode(req.headers.accesstoken).id;
	const shift = new ShiftSchema({
		_id: new mongoose.Types.ObjectId(),
		userId: userId,
		...req.body,
	});
	const shiftExists = await ShiftSchema.findOne({
		$and: [{ shift_date: shift.shift_date }, { userId: userId }],
	});
	if (shiftExists) {
		return sendResponse(
			res,
			409,
			"Conflict",
			`Shift already entered on ${shift.shift_date} !`
		);
	}
	req.data = shift;
	next();
};
