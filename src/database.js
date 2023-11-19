/**
 * Represents a CouchDB database.
 */
export class Database {

	/**
	 * The database name.
	 * @type {string}
	 */
	name;

	/**
	 * The associated server.
	 * @type {import("./server.js").Server}
	 */
	server;

	/**
	 * Creates a new database.
	 * @param {string} name The database name.
	 * @param {import("./server.js").Server} server The associated server.
	 */
	constructor(name, server) {
		this.name = name;
		this.server = server;
	}
}
