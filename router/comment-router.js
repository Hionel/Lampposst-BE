import express from "express";
import * as commentController from "../controllers/comment-controller.js";
import * as validationMiddleware from "../middleware/validation-middleware.js";

const commentRouter = express.Router();

commentRouter.get(
	"/",
	validationMiddleware.validateSignToken,
	validationMiddleware.validateAdminPermission,
	commentController.getAllComments
);
commentRouter.get(
	"/:id",
	validationMiddleware.validateSignToken,
	commentController.getCommentById
);
commentRouter.post(
	"/",
	validationMiddleware.validateSignToken,
	commentController.createComment
);
commentRouter.patch(
	"/:id",
	validationMiddleware.validateSignToken,
	validationMiddleware.validateUpdate,
	commentController.updateCommentById
);
commentRouter.delete(
	"/:id",
	validationMiddleware.validateSignToken,
	validationMiddleware.validateAdminPermission,
	commentController.deleteComment
);
commentRouter.get(
	"/user/:userId",
	validationMiddleware.validateSignToken,
	commentController.getAllUserComments
);

export default commentRouter;
