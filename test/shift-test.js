import { expiredToken, adminToken, userToken, api } from "./user-test.js";

let createdShiftId;

describe("Create a Shift entry", () => {
	it("should return an error if the user is not logged in", (done) => {
		api
			.post("/api/shifts")
			.send({
				start: "10:00",
				end: "18:00",
				pay_perHour: 2,
			})
			.expect(404, done);
	});
	it("should return an error if the token expired", (done) => {
		api.post(`/api/shifts`).set("Accesstoken", expiredToken).expect(403, done);
	});
	it("should return an error if any of the required fields from field data is missing ", (done) => {
		api
			.post("/api/shifts")
			.set("Accesstoken", userToken)
			.send({
				start: "10:00",
				pay_perHour: 20,
			})
			.expect(400, done);
	});
	it("should add a shift to DB ", (done) => {
		api
			.post("/api/shifts")
			.set("Accesstoken", userToken)
			.send({
				start: "10:00",
				end: "18:00",
				place: "Q1",

				pay_perHour: 20,
			})
			.expect(201)
			.end((err, res) => {
				createdShiftId = res.body.data._id;
				done();
			});
	});
	it("should return an error if the shift is already entered by the same user on the same date", (done) => {
		api
			.post("/api/shifts")
			.set("Accesstoken", userToken)
			.send({
				start: "10:00",
				end: "18:00",
				place: "Q1",
				pay_perHour: 2,
			})
			.expect(409, done);
	});
});

describe("Get a Shift by ID ,", () => {
	it("should return error if the user is not logged in", (done) => {
		api.get(`/api/shifts/${createdShiftId}`).expect(404, done);
	});
	it("should return error for expired token", (done) => {
		api
			.get(`/api/shifts/${createdShiftId}`)
			.set("Accesstoken", expiredToken)
			.expect(403, done);
	});
	it("should get the shift's data", (done) => {
		api
			.get(`/api/shifts/${createdShiftId}`)
			.set("Accesstoken", adminToken)
			.expect(200, done);
	});
});

describe("Update a Shift by ID ,", () => {
	it("should return error if the user is not logged in", (done) => {
		api
			.patch(`/api/shifts/${createdShiftId}`)
			.send({
				place: "QQ1",
			})
			.expect(404, done);
	});

	it("should return error for expired token", (done) => {
		api
			.patch(`/api/shifts/${createdShiftId}`)
			.set("Accesstoken", expiredToken)
			.send({
				place: "QQ1",
			})
			.expect(403, done);
	});

	it("should return an error if the request params has no ID", (done) => {
		api
			.patch(`/api/shifts/`)
			.set("Accesstoken", userToken)
			.send({
				place: "No shift id Here ",
			})
			.expect(404, done);
	});

	it("should return an error if the body has no new data to overwrite the existing one", (done) => {
		api
			.patch(`/api/shifts/${createdShiftId}`)
			.set("Accesstoken", userToken)
			.send({})
			.expect(400, done);
	});

	it("should update the shift's data", (done) => {
		api
			.get(`/api/shifts/${createdShiftId}`)
			.set("Accesstoken", adminToken)
			.send({
				place: "QQ1",
			})
			.expect(200, done);
	});
});

describe("Delete a Shift entry", () => {
	it("should return error if the user is not logged in", (done) => {
		api.delete(`/api/shifts/${createdShiftId}`).expect(404, done);
	});
	it("should return error for expired token", (done) => {
		api
			.delete(`/api/shifts/${createdShiftId}`)
			.set("Accesstoken", expiredToken)
			.expect(403, done);
	});

	it("should return error for missing admin permission", (done) => {
		api
			.delete(`/api/shifts/${createdShiftId}`)
			.set("Accesstoken", userToken)
			.expect(401, done);
	});

	it("should delete a shift entry", (done) => {
		api
			.delete(`/api/shifts/${createdShiftId}`)
			.set("Accesstoken", adminToken)
			.expect(200, done);
	});
});

describe("Get all Shifts", () => {
	it("should return an error if the user is not logged in", (done) => {
		api
			.get("/api/shifts")
			.send({
				start: "10:00",
				end: "18:00",
				pay_perHour: 2,
			})
			.expect(404, done);
	});
	it("should return an error if the token expired", (done) => {
		api.get(`/api/shifts`).set("Accesstoken", expiredToken).expect(403, done);
	});
	it("should return an error if user is not an admin", (done) => {
		api.get(`/api/shifts`).set("Accesstoken", userToken).expect(401, done);
	});
	it("should get all data", (done) => {
		api.get(`/api/shifts`).set("Accesstoken", adminToken).expect(200, done);
	});
});
