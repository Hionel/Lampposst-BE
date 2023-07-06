import * as mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	description: { type: String, required: true },
	created: { type: String, default: new Date().toDateString() },
	updated: { type: String, default: "Not updated" },
});

export const CommentSchema = mongoose.model("comments", commentSchema);
