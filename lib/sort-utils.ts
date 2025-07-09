import type { Client, ClientFieldId } from "./data"

/**
 * @typedef {"asc" | "desc"} SortDirection
 * Represents the direction of sorting: ascending or descending.
 */
export type SortDirection = "asc" | "desc"

/**
 * @typedef {Object} SortCriterion
 * @property {string} id - A unique identifier for the sort criterion, used by dnd-kit.
 * @property {ClientFieldId} field - The ID of the client field to sort by.
 * @property {SortDirection} direction - The sorting direction (ascending or descending).
 */
export type SortCriterion = {
  id: string // Unique ID for dnd-kit to track draggable items
  field: ClientFieldId
  direction: SortDirection
}

/**
 * Applies multiple sorting criteria to an array of clients.
 * Clients are sorted based on the order of criteria provided. If two clients are equal
 * according to one criterion, the next criterion is used.
 *
 * @param {Client[]} clients - The array of client objects to be sorted.
 * @param {SortCriterion[]} criteria - An array of sorting criteria, ordered by priority.
 * @returns {Client[]} A new array of clients, sorted according to the provided criteria.
 */
export const applyMultiSort = (clients: Client[], criteria: SortCriterion[]): Client[] => {
  // If no sorting criteria are provided, return a shallow copy of the original array
  // to avoid direct mutation and ensure consistent behavior.
  if (criteria.length === 0) {
    return [...clients]
  }

  // Create a shallow copy of the clients array to avoid mutating the original array
  return [...clients].sort((a, b) => {
    // Iterate through each sorting criterion in the order of priority
    for (const criterion of criteria) {
      const { field, direction } = criterion

      let valA: any
      let valB: any

      // Special handling for Date objects: convert to timestamp for reliable comparison.
      // If a date field is null/undefined, treat it as 0 for consistent sorting (e.g., at the beginning).
      if (field === "createdAt" || field === "updatedAt") {
        valA = a[field] ? (a[field] as Date).getTime() : 0
        valB = b[field] ? (b[field] as Date).getTime() : 0
      } else {
        // For other field types, directly use their values.
        valA = a[field]
        valB = b[field]
      }

      let comparison = 0

      // Perform comparison based on the type of values.
      // localeCompare for strings provides correct alphabetical sorting for various languages.
      if (typeof valA === "string" && typeof valB === "string") {
        comparison = valA.localeCompare(valB)
      } else if (typeof valA === "number" && typeof valB === "number") {
        // Direct subtraction for numbers.
        comparison = valA - valB
      } else {
        // Fallback for other types or mixed types.
        // This handles booleans, undefined, null, etc., by simple less than/greater than.
        if (valA < valB) comparison = -1
        else if (valA > valB) comparison = 1
      }

      // If a comparison yields a non-zero result, it means a difference was found.
      // Apply the direction (asc/desc) and return the result.
      if (comparison !== 0) {
        return direction === "asc" ? comparison : -comparison
      }
    }
    // If all criteria result in equality, maintain their relative order (return 0).
    return 0
  })
}
