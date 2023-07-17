import chai from "chai";
import supertest from "supertest";

export const api = supertest("http://localhost:4200");
const validUserId = "64a80df518c36c66d96ddc76";
export const expiredToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTgwZGY1MThjMzZjNjZkOTZkZGM3NiIsImVtYWlsIjoidGVzdDFAbWFpbC5jb20iLCJwZXJtaXNzaW9uIjoiNjRhODBiNzRhYzQ3ZTlmODRiZWFhNzkwIiwiaWF0IjoxNjg5MTY4NTg5LCJleHAiOjE2ODkxNjg1ODl9.7hIcRbSwbgsnxqM2NkwiLsdqbqkMDiLdTNxhl1bRimk";
export let adminToken;
export let userToken;
let freshAccountIDToBeDeleted;

describe("Login", () => {
	it("should return error if the request is missing one of the required fields ", (done) => {
		api
			.post("/api/user/login")
			.send({
				password: "Pass1234!",
			})
			.expect(412, done);
	});
	it("should return error if the account associated with the email doesn't exist in the DB", (done) => {
		api
			.post("/api/user/login")
			.send({
				email: "NotExistingEmail@mail.com",
				password: "Pass1234!",
			})
			.expect(404, done);
	});
	it("should return error if the passwords do NOT match", (done) => {
		api
			.post("/api/user/login")
			.send({
				email: "testA@mail.com",
				password: "NoExistingPassword1234",
			})
			.expect(409, done);
	});

	it("should login the admin", (done) => {
		api
			.post("/api/user/login")
			.send({
				email: "testA@mail.com",
				password: "Pass1234!",
			})
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);
				adminToken = res.headers.accesstoken;
				done();
			});
	});
	it("should login the user", (done) => {
		api
			.post("/api/user/login")
			.send({
				email: "test3@mail.com",
				password: "Pass1234!",
			})
			.expect(200)
			.end((err, res) => {
				if (err) return done(err);
				userToken = res.headers.accesstoken;
				done();
			});
	});
});

describe("Create User/Registration", function () {
	it("should create an user", (done) => {
		api
			.post("/api/user")
			.send({
				email: "mocha4@mail.com",
				firstname: "Horia",
				lastname: "John",
				password: "Pass1234!",
			})
			.set("Accept", "aplication/json")
			.expect(201)
			.end((err, res) => {
				if (err) return done(err);
				freshAccountIDToBeDeleted = res.body.data._id;
				done();
			});
	});

	it("should return error if required fields are missing", (done) => {
		api
			.post("/api/user")
			.send({
				email: "missingfileds@mail.com",
				firstname: "Horia",
				lastname: "John",
			})
			.set("Accept", "aplication/json")
			.expect(412, done);
	});

	it("should return error if an the user already exists", (done) => {
		api
			.post("/api/user")
			.send({
				email: "mocha4@mail.com",
				firstname: "Horia",
				lastname: "John",
				password: "Pass1234!",
			})
			.set("Accept", "aplication/json")
			.expect(409, done);
	});
});

describe("Get All Users", () => {
	it('should return error if the JWT token doesn`t exist in the header`s "Accesstoken" field', (done) => {
		api.get("/api/user").set("Accesstoken", "").expect(404, done);
	});
	it('should return error if the header`s "Accesstoken" has no admin permission', (done) => {
		api.get("/api/user").set("Accesstoken", userToken).expect(401, done);
	});
	it("should return all the users`s data", (done) => {
		api.get("/api/user").set("Accesstoken", adminToken).expect(200, done);
	});
});

describe("Get an User`s data by ID", () => {
	it("should return an error if the token expired", (done) => {
		api
			.get(`/api/user/64a80dff18c36c66d96ddc79`)
			.set("Accesstoken", expiredToken)
			.expect(403, done);
	});
	it("should return an error if the ID doesn't exist in the DB but has good format", (done) => {
		api
			.patch(`/api/user/64a80dc318c36c66d96ddc72`)
			.set("Accesstoken", userToken)
			.expect(400, done);
	});
	it("should return the user's data", (done) => {
		api
			.get(`/api/user/${validUserId}`)
			.set("Accesstoken", userToken)
			.expect(200, done);
	});
});

describe("Update an User`s data by ID", () => {
	it("should return an error if the request params has no ID", (done) => {
		api
			.patch(`/api/user/`)
			.set("Accesstoken", userToken)
			.send({
				firstname: "NewName",
			})
			.expect(404, done);
	});
	it("should return an error if the token expired", (done) => {
		api
			.patch(`/api/user/64a80dff18c36c66d96ddc79`)
			.set("Accesstoken", expiredToken)
			.send({
				firstname: "NewName",
			})
			.expect(403, done);
	});

	it("should return an error if the body has no new data to overwrite the existing one", (done) => {
		api
			.patch(`/api/user/${validUserId}`)
			.set("Accesstoken", userToken)
			.send({})
			.expect(400, done);
	});
	it("should update an user", (done) => {
		api
			.patch(`/api/user/64a80e0e18c36c66d96ddc7f`)
			.set("Accesstoken", userToken)
			.send({
				firstname: "NewName",
			})
			.expect(200, done);
	});
});

describe("Delete an User by ID", () => {
	it("should return an error if the request params has no ID", (done) => {
		api.delete(`/api/user/`).set("Accesstoken", adminToken).expect(404, done);
	});
	it("should return an error if the token expired", (done) => {
		api
			.delete(`/api/user/64a80dff18c36c66d96ddc79`)
			.set("Accesstoken", expiredToken)
			.expect(403, done);
	});
	it("should delete an User", (done) => {
		api
			.delete(`/api/user/${freshAccountIDToBeDeleted}`)
			.set("Accesstoken", adminToken)
			.expect(200, done);
	});
});
