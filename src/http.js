/**
 * An object thrown when an HTTP error occurs.
 */
export class HttpError extends Error {

	/**
	 * The client request.
	 * @type {Request}
	 * @readonly
	 */
	request;

	/**
	 * The server response.
	 * @type {Response}
	 * @readonly
	 */
	response;

	/**
	 * Creates a new HTTP error.
	 * @param {Request} request The client request.
	 * @param {Response} response The server response.
	 * @param {string} [message] The error message.
	 */
	constructor(request, response, message = "") {
		super(message);
		this.name = "HttpError";
		this.request = request;
		this.response = response;
	}

	/**
	 * Value indicating whether the response's status code is between 400 and 499.
	 * @type {boolean}
	 */
	get isClientError() {
		const {status} = this.response;
		return status >= 400 && status < 500;
	}

	/**
	 * Value indicating whether the response's status code is between 500 and 599.
	 * @type {boolean}
	 */
	get isServerError() {
		const {status} = this.response;
		return status >= 500 && status < 600;
	}
}

/**
 * Provides common HTTP headers.
 * @enum {string}
 */
export const HttpHeader = Object.freeze({

	/**
	 * The `Accept` header.
	 */
	accept: "Accept",

	/**
	 * The `Authorization` header.
	 */
	authorization: "Authorization",

	/**
	 * The `Content-Length` header.
	 */
	contentLength: "Content-Length",

	/**
	 * The `Content-Type` header.
	 */
	contentType: "Content-Type",
});

/**
 * Provides common HTTP methods.
 * @enum {string}
 */
export const HttpMethod = Object.freeze({

	/**
	 * The `COPY` method.
	 */
	copy: "COPY",

	/**
	 * The `DELETE` method.
	 */
	delete: "DELETE",

	/**
	 * The `GET` method.
	 */
	get: "GET",

	/**
	 * The `HEAD` method.
	 */
	head: "HEAD",

	/**
	 * The `PATCH` method.
	 */
	patch: "PATCH",

	/**
	 * The `POST` method.
	 */
	post: "POST",

	/**
	 * The `PUT` method.
	 */
	put: "PUT"
});

/**
 * Provides common MIME types.
 * @enum {string}
 */
export const MimeType = Object.freeze({

	/**
	 * The `application/json` MIME type.
	 */
	applicationJson: "application/json",

	/**
	 * The `text/plain` MIME type.
	 */
	textPlain: "text/plain"
});

/**
 * Fetches a resource from the network.
 * @param {URL} url The resource URL.
 * @param {RequestInit} [options] The fetch options.
 * @returns {Promise<Response>} The HTTP response.
 */
export async function http(url, options) {
	const request = new Request(`${url.origin}${url.pathname}${url.search}`, options);
	if (!request.headers.has(HttpHeader.accept)) request.headers.set(HttpHeader.accept, MimeType.applicationJson);

	if (url.username.length) {
		const credentials = url.password.length ? `${url.username}:${url.password}` : url.username;
		request.headers.set(HttpHeader.authorization, `Basic ${Buffer.from(credentials).toString("base64")}`);
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
