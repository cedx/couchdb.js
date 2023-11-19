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
	 * @param {string} name The user name.
	 * @param {string[]} [roles] The user roles.
	 */
	constructor(name, roles = []) {
		this.name = name;
		this.roles = roles;
	}
}

/**
 * Provides information about a user.
 * @typedef {object} UserInfo
 * @property {string|null} name The user name.
 * @property {string[]} roles The user roles.
 */
