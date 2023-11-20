import assert from "node:assert/strict";
import process from "node:process";
import {describe, it} from "node:test";
import {Server, Session, SessionHandler} from "#couchdb";
import {HttpError, HttpStatus} from "../src/http.js";

/**
 * Tests the features of the {@link Session} class.
 */
describe("Session", () => {
	const server = new Server(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@localhost:5984/`);

	describe("create()", () => {
		const session = new Session(server);
		const userName = /** @type {string} */ (process.env.COUCHDB_USER);

		it("should reject if the credentials are invalid", async () => assert.rejects(() => session.create("foo", "bar"), error => {
			assert(error instanceof HttpError);
			assert.equal(error.response.status, HttpStatus.unauthorized);
			return true;
		}));

		it("should resolve with an authorization token if the credentials are valid", async () => {
			const newSession = await session.create(userName, /** @type {string} */ (process.env.COUCHDB_PASSWORD));
			assert(newSession.token.length > 60);

			const {user} = newSession;
			assert.equal(user?.name, userName);
			assert(user?.roles.some(role => role == "_admin"));
		});
	});

	describe("delete()", () => {
		it("should not reject", () => assert.doesNotReject(new Session(server).delete()));
	});

	describe("fetch()", () => {
		it("should return a new instance containing session information", async () => {
			const session = await new Session(server).fetch();
			assert(session.handlers.some(handler => handler == SessionHandler.basic));
			assert.equal(session.user?.name, process.env.COUCHDB_USER);
		});
	});
});
