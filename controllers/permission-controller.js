import { getAll } from "./controllers-utils.js";
import { PermissionSchema } from "../models/permissionSchema.js";

export const getAllPermissions = async (req, res) => {
	return await getAll(res, PermissionSchema, {}, "", "permissions");
};
