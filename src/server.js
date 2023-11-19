import {Database} from "./database.js";
import {HttpError, HttpHeader, HttpMethod, HttpStatus, MimeType} from "./http.js";

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
	 * Creates a new server.
	 * @param {string} url The server URL, including username and password if required.
	 * @param {ServerOptions} [options] An object providing values to initialize this instance.
	 */
	constructor(url, options = {}) {
		this.features = options.features ?? [];
		this.gitSha = options.gitSha ?? "";
		this.url = new URL(url.slice(-1) == "/" ? url : `${url}/`);
		this.uuid = options.uuid ?? "";
		this.vendor = options.vendor ?? "";
		this.version = options.version ?? "";
	}

	/**
	 * The list of all databases.
	 * @type {Promise<Database[]>}
	 */
	get databases() {
		return this.request("_all_dbs")
			.then(response => response.json())
			.then((/** @type {string[]} */ names) => names.map(name => new Database(name, this)));
	}

	/**
	 * The binary content for the `favicon.ico` site icon.
	 * @type {Promise<Blob>}
	 */
	get favicon() {
		return this.request("favicon.ico").then(response => response.blob());
	}

	/**
	 * Value indicating whether this server is up.
	 * @type {Promise<boolean>}
	 */
	get isUp() {
		return this.request("_up").then(() => true).catch(error => {
			if (error instanceof HttpError && error.response.status == HttpStatus.notFound) return false;
			throw error;
		});
	}

	/**
	 * Returns information about the current session.
	 * @type {Promise<Session>}
	 */
	// get session: Promise<Session>;
	// 	function get_session() return new Session({server: this}).fetch();

	/**
	 * The list of active tasks.
	 * @type {Promise<Task[]>}
	 */
	// get tasks: Promise<List<Task>>;
	// 	function get_tasks() return remote.tasks().next(List.fromArray);

	/**
	 * Initiates a new session for the specified user credentials.
	 */
	// authenticate(name: String, password: String) return new Session({server: this}).create(name, password);

	/**
	 * Returns an object for performing operations on a database.
	 * @param {string} name The database name.
	 * @returns {Database} The database object.
	 */
	db(name) {
		return new Database(name, this);
	}

	/**
	 * Fetches information about this server.
	 * @returns {Promise<Server>} The server information.
	 */
	async fetch() {
		const json = /** @type {ServerInfo} */ (await (await this.request("")).json());
		return new Server(this.url.href, {
			features: json.features,
			gitSha: json.git_sha,
			uuid: json.uuid,
			vendor: json.vendor.name,
			version: json.version
		});
	}

	/**
	 * Performs a custom HTTP request.
	 * @param {string} url The resource URL.
	 * @param {RequestInit} [options] The fetch options.
	 * @returns {Promise<Response>} The HTTP response.
	 */
	async request(url, options) {
		const endpoint = new URL(url, this.url);
		const request = new Request(`${endpoint.origin}${endpoint.pathname}${endpoint.search}`, options);
		if (!request.headers.has(HttpHeader.accept)) request.headers.set(HttpHeader.accept, MimeType.applicationJson);

		if (endpoint.username.length) {
			const credentials = endpoint.password.length ? `${endpoint.username}:${endpoint.password}` : endpoint.username;
			request.headers.set(HttpHeader.authorization, `Basic ${btoa(credentials)}`);
		}

		const methods = /** @type {string[]} */ ([HttpMethod.patch, HttpMethod.post, HttpMethod.put]);
		if (methods.includes(request.method)) {
			const [mimeType] = (request.headers.get(HttpHeader.contentType) ?? "").split(";");
			if (!mimeType || mimeType == MimeType.textPlain) request.headers.set(HttpHeader.contentType, MimeType.applicationJson);
		}

		const response = await fetch(request);
		if (!response.ok) throw new HttpError(request, response);
		return response;
	}

	/**
	 * Requests one or more Universally Unique Identifiers (UUIDs) from this server.
	 * @param {number} [count] The number of UUIDs to generate.
	 * @returns {Promise<string[]>} The generated UUIDs.
	 */
	async uuids(count = 1) {
		const query = new URLSearchParams({count: String(count)});
		const json = /** @type {{uuids: string[]}} */ (await (await this.request(`_uuids?${query}`)).json());
		return json.uuids;
	}
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
 * @property {string} couchdb A custom welcome message.
 * @property {string[]} features The list of features supported by the server.
 * @property {string} git_sha The Git revision.
 * @property {string} uuid The server identifier.
 * @property {{name: string}} vendor Meta information about the vendor.
 * @property {string} version The version number.
 */
