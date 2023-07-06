import express from "express";
import { getAllPermissions } from "../controllers/permission-controller.js";
import * as validationMiddleware from "../middleware/validation-middleware.js";

const permisionRouter = express.Router();

permisionRouter.get(
	"/",
	validationMiddleware.validateSignToken,
	getAllPermissions
);

export default permisionRouter;
