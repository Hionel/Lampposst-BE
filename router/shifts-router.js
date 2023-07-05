import express from "express";
import * as shiftsController from "../controllers/shifts-controller.js";
import * as validationMiddleware from "../middleware/validation-middleware.js";

const shiftsRouter = express.Router();

shiftsRouter.get(
	"/",
	validationMiddleware.validateSignToken,
	validationMiddleware.validateAdminPermission,
	shiftsController.getAllShifts
);
shiftsRouter.get(
	"/:id",
	validationMiddleware.validateSignToken,
	shiftsController.getShiftById
);
shiftsRouter.patch(
	"/:id",
	validationMiddleware.validateSignToken,
	validationMiddleware.validateUpdate,
	shiftsController.updateShiftById
);
shiftsRouter.delete(
	"/:id",
	validationMiddleware.validateSignToken,
	validationMiddleware.validateAdminPermission,
	shiftsController.deleteShift
);
shiftsRouter.post(
	"/",
	validationMiddleware.validateSignToken,
	validationMiddleware.validateShiftEntry,
	shiftsController.addShift
);

export default shiftsRouter;
