import * as mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	description: { type: String, required: true },
});

export const PermissionSchema = mongoose.model("permissions", permissionSchema);
