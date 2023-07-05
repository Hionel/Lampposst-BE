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
