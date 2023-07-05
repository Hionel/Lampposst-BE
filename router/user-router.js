import express from "express";
import * as userController from "../controllers/user-controller.js";
import * as validationMiddleware from "../middleware/validation-middleware.js";

const userRouter = express.Router();
// User routes
userRouter.get(
	"/",
	validationMiddleware.validateSignToken,
	validationMiddleware.validateAdminPermission,
	userController.getAllUsers
);
userRouter.get(
	"/:id",
	validationMiddleware.validateSignToken,
	userController.getUserById
);
userRouter.patch(
	"/:id",
	validationMiddleware.validateSignToken,
	validationMiddleware.validateUpdate,
	userController.updateUserById
);
userRouter.delete(
	"/:id",
	validationMiddleware.validateSignToken,
	validationMiddleware.validateAdminPermission,
	userController.deleteUser
);
// Auth routes
userRouter.post(
	"/",
	validationMiddleware.validateUserRegistration,
	userController.createUser
);
userRouter.post(
	"/login",
	validationMiddleware.validateLogin,
	userController.login
);

export default userRouter;
