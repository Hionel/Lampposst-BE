export const sendResponse = (
	res,
	statusCode,
	statusText,
	message,
	data = null
) => {
	const responseJSON = { status: statusText, msg: message };
	if (!data) {
		return res.status(statusCode).json(responseJSON);
	}
	responseJSON.data = data;
	return res.status(statusCode).json(responseJSON);
};

export const addEntryToDB = async (res, schema, document) => {
	try {
		await schema.save();
		return sendResponse(
			res,
			201,
			"Created",
			`Entry added to ${document} succesfully!`,
			schema
		);
	} catch (error) {
		return sendResponse(res, 400, "Bad request", `${error}`);
	}
};

export const getAll = async (res, schema, query, queryProjection, document) => {
	try {
		const dataArray = await schema.find(query).select(queryProjection);
		return sendResponse(
			res,
			200,
			"OK",
			`All ${document}' data retrieved !`,
			dataArray
		);
	} catch (error) {
		return sendResponse(res, 400, "Bad request", `${error}`);
	}
};

export const getById = async (res, schema, id, document, queryProjection) => {
	try {
		const data = await schema.findById(id).select(queryProjection);
		return sendResponse(res, 200, "Ok", `${document} found!`, data);
	} catch (error) {
		return sendResponse(res, 400, "Bad request", `${error}`);
	}
};

export const updateById = async (res, schema, id, newData, document) => {
	try {
		const updateResult = await schema.updateOne({ _id: id }, { $set: newData });
		if (!updateResult.acknowledged) {
			return sendResponse(res, 408, "Request timed out", "Update failed");
		}
		return sendResponse(res, 200, "Ok", `${id}'s ${document} data updated!`);
	} catch (error) {
		return sendResponse(res, 400, "Bad request", `${error}`);
	}
};

export const deleteData = async (res, schema, id, document) => {
	try {
		await schema.deleteOne({ _id: id });
		return sendResponse(
			res,
			200,
			"Ok",
			`${document}: ${id} was deleted succesfully!`
		);
	} catch (error) {
		return sendResponse(res, 400, "Bad request", `${error}`);
	}
};
