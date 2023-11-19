/**
 * Represents a CouchDB task.
 */
export class Task {

	/**
	 * The number of processed changes.
	 * @type {number}
	 */
	changesDone;

	/**
	 * The name of the source database.
	 * @type {string}
	 */
	database;

	/**
	 * The process identifier.
	 * @type {string}
	 */
	pid;

	/**
	 * The current percentage progress.
	 * @type {number}
	 */
	progress;

	/**
	 * The Unix timestamp of the task start time.
	 * @type {Date}
	 */
	startedOn;

	/**
	 * The total number of changes to process.
	 * @type {number}
	 */
	totalChanges;

	/**
	 * The operation type.
	 * @type {TaskType}
	 */
	type;

	/**
	 * The Unix timestamp of the last operation update.
	 * @type {Date}
	 */
	updatedOn;

	/**
	 * Creates a new task.
	 * @param {TaskOptions} options An object providing values to initialize this instance.
	 */
	constructor(options) {
		this.changesDone = options.changesDone;
		this.database = options.database;
		this.pid = options.pid;
		this.progress = options.progress;
		this.startedOn = options.startedOn;
		this.totalChanges = options.totalChanges;
		this.type = options.type;
		this.updatedOn = options.updatedOn;
	}

	/**
	 * Creates a new task from the specified JSON object.
	 * @param {TaskInfo} json A JSON object representing a task.
	 * @returns {Task} The instance corresponding to the specified JSON object.
	 */
	static fromJson(json) {
		return new this({
			changesDone: json.changes_done,
			database: json.database,
			pid: json.pid,
			progress: json.progress,
			startedOn: new Date(json.started_on * 1_000),
			totalChanges: json.total_changes,
			type: json.type,
			updatedOn: new Date(json.updated_on * 1_000)
		});
	}
}

/**
 * Provides information about a task.
 * @typedef {object} TaskInfo
 * @property {number} changes_done The number of processed changes.
 * @property {string} database The name of the source database.
 * @property {string} pid The process identifier.
 * @property {number} progress The current percentage progress.
 * @property {number} started_on The Unix timestamp of the task start time.
 * @property {number} total_changes The total number of changes to process.
 * @property {TaskType} type The operation type.
 * @property {number} updated_on The Unix timestamp of the last operation update.
 */

/**
 * Provides information about a task.
 * @typedef {object} TaskOptions
 * @property {number} changesDone The number of processed changes.
 * @property {string} database The name of the source database.
 * @property {string} pid The process identifier.
 * @property {number} progress The current percentage progress.
 * @property {Date} startedOn The Unix timestamp of the task start time.
 * @property {number} totalChanges The total number of changes to process.
 * @property {TaskType} type The operation type.
 * @property {Date} updatedOn The Unix timestamp of the last operation update.
 */

/**
 * Defines the type of a task.
 */
export const TaskType = Object.freeze({

	/**
	 * A database compaction task.
	 */
	databaseCompaction: "database_compaction",

	/**
	 * An indexation task.
	 */
	indexer: "indexer",

	/**
	 * A replication task.
	 */
	replication: "replication",

	/**
	 * A view compaction task.
	 */
	viewCompaction: "view_compaction"
});
