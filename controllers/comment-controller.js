import {
	addEntryToDB,
	getAll,
	getById,
	updateById,
	deleteData,
} from "./controllers-utils.js";
import { CommentSchema } from "../models/commentSchema.js";

export const getAllComments = (req, res) => {
	return getAll(res, CommentSchema, {}, "", "comments");
};
export const getCommentById = (req, res) => {
	const commentId = req.params.id;
	return getById(res, CommentSchema, commentId, "Comment", "");
};
export const createComment = (req, res) => {
	const userId = jwt.decode(req.headers.accesstoken).id;
	const comment = new CommentSchema({
		_id: new mongoose.Types.ObjectId(),
		userId: userId,
		...req.body,
	});
	return addEntryToDB(res, comment, "comments");
};
export const updateCommentById = (req, res) => {
	const commentId = req.params.id;
	const newCommentData = req.body;
	return updateById(res, CommentSchema, commentId, newCommentData, "shift");
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
		`${userId}'s comments'`
	);
};
