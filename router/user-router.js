import express from "express";
import * as userController from "../controllers/user-controller.js";
import * as validationMiddleware from "../middleware/validation-middleware.js";

const userRouter = express.Router();

userRouter.get(
	"/",
	validationMiddleware.validateAdminPermission,
	userController.getAllUsers
);
userRouter.get("/:id", userController.getUserById);
userRouter.patch(
	"/:id",
	validationMiddleware.validateUserUpdate,
	userController.updateUserById
);
userRouter.delete(
	"/:id",
	validationMiddleware.validateAdminPermission,
	userController.deleteUser
);
userRouter.post(
	"/",
	validationMiddleware.validateUserRegistration,
	userController.createUser
);
userRouter.post("/login");

export default userRouter;
