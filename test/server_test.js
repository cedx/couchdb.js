import assert from "node:assert/strict";
import process from "node:process";
import {describe, it} from "node:test";
import {Server} from "#couchdb";

/**
 * Tests the features of the {@link Server} class.
 */
describe("Server", () => {
	const server = new Server(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@localhost:5984`);

	describe("databases", () => {
		it("should return the list of all databases", async () => {
			const databases = await server.databases;
			assert(databases.some(db => db.name == "_replicator"));
			assert(databases.some(db => db.name == "_users"));
		});
	});

	describe("favicon", () => {
		it("should return the binary content of the icon", async () => assert((await server.favicon).size > 0));
	});

	describe("isUp", () => {
		it("should return `true` if the server is up", async () => assert(await server.isUp));
	});

	describe("db()", () => {
		it("should return a database object", () => assert.equal(server.db("foo").name, "foo"));
	});

	describe("fetch()", () => {
		it("should return a new instance containing server information", async () => {
			const info = await server.fetch();
			assert(info.features.length > 0);
			assert(/[a-z\d]{9}/.test(info.gitSha));
			assert(/[a-z\d]{32}/.test(info.uuid));
			assert.equal(info.vendor, "The Apache Software Foundation");
			assert.equal(info.version.split(".").shift(), "3");
		});
	});

	describe("uuids()", () => {
		it("should return a list of UUIDs", async () => {
			const uuids = await Promise.all([server.uuids(), server.uuids(3)]);
			assert.equal(uuids[0].length, 1);
			assert.equal(uuids[1].length, 3);
			assert(/[a-z\d]{32}/.test(uuids[0][0]));
		});
	});
});
