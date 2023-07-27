import {
	addEntryToDB,
	getAll,
	getById,
	updateById,
	deleteData,
	sendResponse,
} from "./controllers-utils.js";
import { CommentSchema } from "../models/commentSchema.js";
import { UserSchema } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const getAllComments = (req, res) => {
	return getAll(res, CommentSchema, {}, "", "comments");
};
export const getCommentById = (req, res) => {
	const commentId = req.params.id;
	return getById(res, CommentSchema, commentId, "Comment", "");
};
export const createComment = async (req, res) => {
	const userId = jwt.decode(req.headers.accesstoken).id;
	const comment = new CommentSchema({
		_id: new mongoose.Types.ObjectId(),
		userId: userId,
		...req.body,
	});
	try {
		await UserSchema.findByIdAndUpdate(userId, {
			$push: { comments: comment._id },
		});
		return addEntryToDB(res, comment, "comments");
	} catch (error) {
		return sendResponse(res, 400, "Bad request", `${error}`);
	}
};
export const updateCommentById = (req, res) => {
	const commentId = req.params.id;
	const newCommentData = req.body;
	return updateById(res, CommentSchema, commentId, newCommentData, "comment");
};

export const deleteComment = (req, res) => {
	const commentId = req.params.id;
	return deleteData(res, CommentSchema, commentId, "Comment");
};
export const getAllUserComments = async (req, res) => {
	const userId = jwt.decode(req.headers.accesstoken).id;
	return getAll(
		res,
		CommentSchema,
		{ userId: userId },
		"",
		`${userId}'s comments`
	);
};
