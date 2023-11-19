import {http} from "./http.js";

/**
 * Represents a CouchDB server.
 */
export class Server {

	/**
	 * The list of features supported by this server.
	 * @type {string[]}
	 */
	features;

	/**
	 * The Git revision.
	 * @type {string}
	 */
	gitSha;

	/**
	 * The server URL, including username and password if required.
	 * @type {URL}
	 */
	url;

	/**
	 * The server identifier.
	 * @type {string}
	 */
	uuid;

	/**
	 * The vendor name.
	 * @type {string}
	 */
	vendor;

	/**
	 * The version number.
	 * @type {string}
	 */
	version;

	/**
	 * The remote API client.
	 */
	#remote = null;

	/**
	 * Creates a new server.
	 * @param {string|URL} url The server URL, including username and password if required.
	 * @param {ServerOptions} [options] An object providing values to initialize this instance.
	 */
	constructor(url, options = {}) {
		this.url = new URL(url);
		this.features = options.features ?? [];
		this.gitSha = options.gitSha ?? "";
		this.uuid = options.uuid ?? "";
		this.vendor = options.vendor ?? "";
		this.version = options.version ?? "";
	}

	/**
	 * The list of all databases.
	 * @type {Promise<Database[]>}
	 */
	// get databases(get, never): Promise<List<Database>>;
	// 	function get_databases() return remote.databases()
	// 		.next(names -> List.fromArray(names.map(name -> new Database({name: name, server: this}))));

	/**
	 * The binary content for the `favicon.ico` site icon.
	 * @type {Promise<File>}
	 */
	// get favicon(get, never): Promise<Chunk>;
	// 	inline function get_favicon() return remote.favicon();

	/**
	 * Value indicating whether this server is up.
	 * @type {Promise<boolean>}
	 */
	// get isUp(get, never): Promise<Bool>;
	// 	function get_isUp() return remote.isUp()
	// 		.next(_ -> true)
	// 		.tryRecover(error -> error.code == NotFound ? Success(false) : Failure(error));

	/**
	 * Returns information about the current session.
	 * @type {Promise<Session>}
	 */
	// get session(get, never): Promise<Session>;
	// 	function get_session() return new Session({server: this}).fetch();

	/**
	 * The list of active tasks.
	 * @type {Promise<Task[]>}
	 */
	// get tasks(get, never): Promise<List<Task>>;
	// 	function get_tasks() return remote.tasks().next(List.fromArray);

	/**
	 * Initiates a new session for the specified user credentials.
	 */
	// authenticate(name: String, password: String) return new Session({server: this}).create(name, password);

	/**
	 * Returns an object for performing operations on a database.
	 */
	// db(database: String) return new Database({name: database, server: this});

	/**
	 * Fetches information about this server.
	 * @returns {Promise<Server>}
	 */
	async fetch() {
		const response = await http(this.url);
		const json = /** @type {ServerInfo} */ (await response.json());
		return new Server(this.url, {
			features: json.features,
			gitSha: json.git_sha,
			uuid: json.uuid,
			vendor: json.vendor?.name,
			version: json.version
		});
	}

	/**
	 * Requests one or more Universally Unique Identifiers (UUIDs) from this server.
	 */
	// uuids(count = 1) return remote.uuids({count: count}).next(response -> List.fromArray(response.uuids));
}

/**
 * Defines the options of a {@link Server} instance.
 * @typedef {object} ServerOptions
 * @property {string[]} [features] The list of features supported by the server.
 * @property {string} [gitSha] The Git revision.
 * @property {string} [uuid] The server identifier.
 * @property {string} [vendor] Meta information about the vendor.
 * @property {string} [version] The version number.
 */

/**
 * Provides information about a server.
 * @typedef {object} ServerInfo
 * @property {string} [couchdb] A custom welcome message.
 * @property {string[]} [features] The list of features supported by the server.
 * @property {string} [git_sha] The Git revision.
 * @property {string} [uuid] The server identifier.
 * @property {{name: string}} [vendor] Meta information about the vendor.
 * @property {string} [version] The version number.
 */
