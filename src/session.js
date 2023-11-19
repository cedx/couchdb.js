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
 * Defines the options of a {@link Session} instance.
 * @typedef {object} SessionOptions
 * @property {SessionHandler[]} [handlers] The enabled authentication handlers.
 * @property {SessionHandler|null} [method] The handler used to initiate this session.
 * @property {string} [token] The authorization token.
 * @property {import("./user.js").User|null} [user] The session user.
 */

/**
 * Provides information about a session.
 * @typedef {object} SessionInfo
 * @property {{authenticated?: string, authentication_handlers: string[]}} info The server authentication configuration.
 * @property {import("./user.js").UserInfo} userCtx The user context for the current user.
 */