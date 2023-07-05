import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import MongoDb from "./mongoose/mongoose.js";
import userRouter from "./router/user-router.js";
import shiftsRouter from "./router/shifts-router.js";

dotenv.config();

export const mongoPass = process.env.MONGO_PASS;
const mongooseDb = new MongoDb();
const app = express();
const port = process.env.PORT || 3000;

mongooseDb
	.connect()
	.then(() => {
		console.log("Connected to MongoDb");
	})
	.catch((error) => {
		console.log("Error encountered while trying to connect to MongoDb:", error);
	});
app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/shifts", shiftsRouter);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
