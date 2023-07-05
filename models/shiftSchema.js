import * as mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	start: {
		type: String,
		required: true,
	},
	end: {
		type: String,
		required: true,
	},
	pay_perHour: {
		type: Number,
		required: true,
	},
	shift_date: {
		type: String,
		default: new Date().toDateString(),
	},
	updated: {
		type: String,
		default: "Not updated",
	},
});

export const ShiftSchema = mongoose.model("shifts", shiftSchema);
