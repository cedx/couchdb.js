import assert from "node:assert/strict";
import process from "node:process";
import {describe, it} from "node:test";
import {Server, Session, SessionHandler} from "#couchdb";

/**
 * Tests the features of the {@link Session} class.
 */
describe("Session", () => {
	const server = new Server(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@localhost:5984/`);

	describe("create()", () => {
		const session = new Session(server);
		const userName = process.env.COUCHDB_USER;

		it("TODO", async () => {
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
