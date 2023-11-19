import assert from "node:assert/strict";
import process from "node:process";
import {describe, it} from "node:test";
import {Server} from "#couchdb";

/**
 * Tests the features of the {@link Server} class.
 */
describe("Server", () => {
	const server = new Server(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@localhost:5984`);

	describe("fetch()", () => {
		it("should return a new instance containing server information", async () => {
			const info = await server.fetch();
			assert.ok(info.features.length > 0);
			assert.ok(/[a-z\d]{9}/.test(info.gitSha));
			assert.ok(/[a-z\d]{32}/.test(info.uuid));
			assert.equal(info.vendor, "The Apache Software Foundation");
			assert.equal(info.version.split(".").shift(), "3");
		});
	});

	describe("uuids()", () => {
		it("should return a list of UUIDs", async () => {
			const uuids = await Promise.all([server.uuids(), server.uuids(3)]);
			assert.equal(uuids[0].length, 1);
			assert.equal(uuids[1].length, 3);
			assert.ok(/[a-z\d]{32}/.test(uuids[0][0]));
		});
	});
});
