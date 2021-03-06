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
	contentType: "Content-Type"
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
 * Provides common HTTP status codes.
 * @enum {number}
 */
export const HttpStatus = Object.freeze({

	/**
	 * The `OK` status.
	 */
	ok: 200,

	/**
	 * The `Created` status.
	 */
	created: 201,

	/**
	 * The `No Content` status.
	 */
	noContent: 204,

	/**
	 * The `Bad Request` status.
	 */
	badRequest: 400,

	/**
	 * The `Unauthorized` status.
	 */
	unauthorized: 401,

	/**
	 * The `Forbidden` status.
	 */
	forbidden: 403,

	/**
	 * The `Not Found` status.
	 */
	notFound: 404,

	/**
	 * The `Method Not Allowed` status.
	 */
	methodNotAllowed: 405,

	/**
	 * The `Unprocessable Entity` status.
	 */
	unprocessableEntity: 422,

	/**
	 * The `Internal Server Error` status.
	 */
	internalServerError: 500,

	/**
	 * The `Not Implemented` status.
	 */
	notImplemented: 501,

	/**
	 * The `Service Unavailable` status.
	 */
	serviceUnavailable: 503
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
