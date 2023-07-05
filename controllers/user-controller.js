import { UserSchema } from "../models/userSchema.js";
import { sendResponse } from "./controllers-utils.js";
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
	try {
		const usersArray = await UserSchema.find({ permission: "user" }).select(
			"-password"
		);
		return sendResponse(
			res,
			200,
			"OK",
			"All users' data retrieved !",
			usersArray
		);
	} catch (error) {
		return sendResponse(res, 400, "Bad request", `${error}`);
	}
};

export const getUserById = async (req, res) => {
	const userID = req.params.id;
	try {
		const userData = await UserSchema.findById(userID);
		return sendResponse(res, 200, "Ok", "User found!", userData);
	} catch (error) {
		return sendResponse(res, 400, "Bad request", `${error}`);
	}
};

export const updateUserById = async (req, res) => {
	const userID = req.params.id;
	const newUserData = req.body;
	try {
		const updateResult = await UserSchema.updateOne(
			{ _id: userID },
			{ $set: newUserData }
		);
		if (!updateResult.acknowledged) {
			return sendResponse(res, 408, "Request timed out", "Update failed");
		}
		return sendResponse(res, 200, "Ok", `${userID}'s account data updated!`);
	} catch (error) {
		return sendResponse(res, 400, "Bad request", `${error}`);
	}
};

export const deleteUser = async (req, res) => {
	const accountID = req.params.id;
	try {
		await UserSchema.deleteOne({ _id: accountID });
		return sendResponse(
			res,
			200,
			"Ok",
			`Account: ${accountID} was deleted succesfully!`
		);
	} catch (error) {
		return sendResponse(res, 400, "Bad request", `${error}`);
	}
};

export const createUser = async (req, res) => {
	const user = new UserSchema({
		_id: new mongoose.Types.ObjectId(),
		...req.body,
	});
	try {
		await user.save();
		return sendResponse(
			res,
			201,
			"Created",
			"Created account succesfully!",
			user
		);
	} catch (error) {
		return sendResponse(res, 400, "Bad request", `${error}`);
	}
};
