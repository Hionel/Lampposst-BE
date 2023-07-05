import * as mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {
		type: String,
		min: 6,
		max: 26,
	},
	firstname: {
		type: String,
		min: 2,
		max: 15,
	},
	lastname: {
		type: String,
		min: 2,
		max: 15,
	},
	password: {
		type: String,
		min: 6,
		max: 18,
	},
	creation_date: {
		type: String,
		default: new Date().toUTCString(),
	},
	updated: {
		type: String,
		default: "Not updated",
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "comments",
			default: "No comments",
		},
	],
	permission: {
		type: String,
		ref: "permission",
		default: "user",
	},
});

userSchema.pre("save", function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = bcryptjs.genSaltSync(10);
	const hashPassword = bcryptjs.hashSync(this.password, salt);
	this.password = hashPassword;
	next();
});

export const UserSchema = mongoose.model("users", userSchema);
