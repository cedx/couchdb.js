/**
 * Represents a CouchDB task.
 */
class Task {

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
 * @property {string} type The operation type.
 * @property {number} updated_on The Unix timestamp of the last operation update.
 */
