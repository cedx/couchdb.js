import {HttpMethod} from "./http.js";
import {User} from "./user.js";

/**
 * Represents a CouchDB session.
 */
export class Session {

	/**
	 * The enabled authentication handlers.
	 * @type {SessionHandler[]}
	 */
	handlers;

	/**
	 * The handler used to initiate this session.
	 * @type {SessionHandler|null}
	 */
	method;

	/**
	 * The associated server.
	 * @type {import("./server.js").Server}
	 */
	server;

	/**
	 * The authorization token.
	 * @type {string}
	 */
	token;

	/**
	 * The session user.
	 * @type {import("./user.js").User|null}
	 */
	user;

	/**
	 * Creates a new session.
	 * @param {import("./server.js").Server} server The associated server.
	 * @param {SessionOptions} [options] An object providing values to initialize this instance.
	 */
	constructor(server, options = {}) {
		this.handlers = options.handlers ?? [];
		this.method = options.method ?? null;
		this.server = server;
		this.token = options.token ?? "";
		this.user = options.user ?? null;
	}

	/**
	 * Initiates a new session for the specified user credentials.
	 * @param {string} name The user name.
	 * @param {string} password The user password.
	 * @returns {Promise<Session>} The newly created session.
	 */
	async create(name, password) {
		const response = await this.server.request("_session", {
			method: HttpMethod.post,
			// TODO: headers contentLength
			body: JSON.stringify({name, password})
		});

		const cookies = response.headers.getSetCookie();
		console.log(cookies); // TODO
		if (cookies.length == 0) throw Error("TODO");

		return new Session(this.server, {
			handlers: this.handlers,
			method: this.method,
			token: cookies[0].split("=").pop(),
			user: new User(await response.json())
		});
	}

	/**
	 * Deletes this session.
	 * @returns {Promise<Response>} Resolves when the session has been deleted.
	 */
	delete() {
		return this.server.request("_session", {method: HttpMethod.delete});
	}

	/**
	 * Fetches information about this session.
	 * @returns {Promise<Session>} The session information.
	 */
	async fetch() {
		const json = /** @type {SessionInfo} */ (await (await this.server.request("_session")).json());
		return new Session(this.server, {
			handlers: json.info.authentication_handlers,
			method: json.info.authenticated,
			token: this.token,
			user: json.userCtx.name == null ? null : new User({name: json.userCtx.name, roles: json.userCtx.roles})
		});
	}
}

/**
 * Provides the list of supported authentication handlers.
 * @enum {string}
 */
export const SessionHandler = Object.freeze({

	/**
	 * Basic authentication.
	 */
	basic: "default",

	/**
	 * Cookie authentication.
	 */
	cookie: "cookie"
});

/**
 * Provides information about a session.
 * @typedef {object} SessionInfo
 * @property {{authenticated?: string, authentication_handlers: string[]}} info The server authentication configuration.
 * @property {import("./user.js").UserInfo} userCtx The user context for the current user.
 */

/**
 * Defines the options of a {@link Session} instance.
 * @typedef {object} SessionOptions
 * @property {SessionHandler[]} [handlers] The enabled authentication handlers.
 * @property {SessionHandler|null} [method] The handler used to initiate this session.
 * @property {string} [token] The authorization token.
 * @property {import("./user.js").User|null} [user] The session user.
 */
