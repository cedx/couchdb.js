/**
 * Represents a CouchDB user.
 */
export class User {

	/**
	 * The user name.
	 * @type {string}
	 */
	name;

	/**
	 * The user roles.
	 * @type {string[]}
	 */
	roles;

	/**
	 * Creates a new user.
	 * @param {UserOptions} [options] An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		this.name = options.name ?? "";
		this.roles = options.roles ?? [];
	}
}

/**
 * Provides information about a user.
 * @typedef {object} UserInfo
 * @property {string|null} name The user name.
 * @property {string[]} roles The user roles.
 */

/**
 * Provides information about a user.
 * @typedef {object} UserOptions
 * @property {string} [name] The user name.
 * @property {string[]} [roles] The user roles.
 */
