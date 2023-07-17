import { PermissionSchema } from "../models/permissionSchema.js";
import { UserSchema } from "../models/userSchema.js";
import {
	sendResponse,
	addEntryToDB,
	getAll,
	getById,
	updateById,
	deleteData,
} from "./controllers-utils.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
	const userPermissionCode = (
		await PermissionSchema.findOne({ description: "user" })
	)._id.toString();
	const query = { permission: userPermissionCode };
	const queryProjection = "-password";
	return getAll(res, UserSchema, query, queryProjection, "users");
};

export const getUserById = async (req, res) => {
	const userID = req.params.id;
	return getById(res, UserSchema, userID, "User", "-password");
};

export const updateUserById = async (req, res) => {
	const userID = req.params.id;
	const newUserData = req.body;
	return updateById(res, UserSchema, userID, newUserData, "user");
};

export const deleteUser = async (req, res) => {
	const accountID = req.params.id;
	return deleteData(res, UserSchema, accountID, "Account");
};

// Auth functions
export const createUser = async (req, res) => {
	const user = new UserSchema({
		_id: new mongoose.Types.ObjectId(),
		...req.body,
	});
	return addEntryToDB(res, user, "users");
};

export const login = (req, res) => {
	try {
		const user = req.data;
		const { id, email, permission } = user;
		const sessionJwt = signToken(id, email, permission);
		res.setHeader("Accesstoken", sessionJwt);
		return sendResponse(res, 200, "Ok", `Login succesfull!`);
	} catch (error) {
		return sendResponse(res, 400, "Bad request", `${error}`);
	}
};

const signToken = (id, email, permission) => {
	const tokenData = {
		id: id,
		email: email,
		permission: permission,
	};
	const secretKey = process.env.JWT_PASS;
	const expiryTime = process.env.JWT_EXPIRY;
	return jwt.sign(tokenData, secretKey, {
		expiresIn: expiryTime,
	});
};
