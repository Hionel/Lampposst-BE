import { mongoPass } from "../index.js";
import * as mongoose from "mongoose";

export default class MongoDb {
	uri = `mongodb+srv://ianglabxratxry:${mongoPass}@lamppost.vwh9iqf.mongodb.net/Lamppost?retryWrites=true&w=majority`;

	connect = async () => {
		try {
			await mongoose.connect(this.uri, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
		} catch (error) {
			throw error;
		}
	};
}
