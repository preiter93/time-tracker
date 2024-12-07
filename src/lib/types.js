/**
 * @namespace type
 */

/**
 * @typedef {Object} TimerItem
 * @property {string} id
 * @property {string} name
 * @property {number} duration
 * @property {number} offsetDuration
 * @property {boolean} isRunning
 * @property {boolean} [requestFocus=false]
 * @property {boolean} isExpanded
 * @property {string} notes
 */

/**
 * @typedef {Object} TodoItem
 * @property {string} id
 * @property {string} content
 */

// This is a simple generic type for PageData
/**
 * @template T
 * @typedef {Object} PageData
 * @property {Object} items
 * @property {T} items.data
 */

export const unused = {}
