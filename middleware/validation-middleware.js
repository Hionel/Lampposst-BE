import { UserSchema } from "../models/userSchema.js";
import { sendResponse } from "../controllers/controllers-utils.js";

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

export const validateUserUpdate = async (req, res, next) => {
	const userID = req.params.id;
	const newUserData = req.body;
	if (!userID) {
		return sendResponse(res, 400, "Bad request", "Request has no ID!");
	}
	if (!newUserData || Object.keys(newUserData).length < 1) {
		return sendResponse(res, 400, "Bad request", "Request has no data!");
	}
	next();
};

export const validateAdminPermission = async (req, res, next) => {
	const { id, user } = req.body;
	if (!id) {
		return sendResponse(res, 400, "Bad request", "Request has no ID!");
	}
	const dbUserData = await UserSchema.findById(id);
	if (
		user.permission !== "admin" ||
		user.permission !== dbUserData.permission ||
		user.email !== dbUserData.email ||
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
