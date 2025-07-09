import { faker } from "@faker-js/faker"

/**
 * @typedef {Object} Client
 * @property {string} id - Unique identifier for the client.
 * @property {string} name - Full name of the client.
 * @property {string} email - Email address of the client.
 * @property {Date} createdAt - Date and time when the client record was created.
 * @property {Date} updatedAt - Date and time when the client record was last updated.
 * @property {"active" | "inactive" | "pending" | "suspended"} status - Current status of the client.
 */
export type Client = {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
  status: "active" | "inactive" | "pending" | "suspended"
}

/**
 * Generates a specified number of mock client records using faker-js.
 * @param {number} count - The number of mock clients to generate.
 * @returns {Client[]} An array of mock client objects.
 */
export const generateMockClients = (count: number): Client[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: faker.string.uuid(), // Generate a unique ID for each client
    name: faker.person.fullName(), // Generate a random full name
    email: faker.internet.email(), // Generate a random email address
    createdAt: faker.date.past({ years: 2 }), // Generate a creation date within the last 2 years
    updatedAt: faker.date.recent({ days: 30 }), // Generate an update date within the last 30 days
    status: faker.helpers.arrayElement(["active", "inactive", "pending", "suspended"]), // Randomly select a status
  }))
}

/**
 * Defines the fields available for sorting and display in the client table.
 * Each object contains an `id` (for internal use), a `label` (for display), and a `type` (for sorting logic).
 */
export const clientFields = [
  { id: "name", label: "Name", type: "string" },
  { id: "email", label: "Email", type: "string" },
  { id: "createdAt", label: "Created At", type: "date" },
  { id: "updatedAt", label: "Updated At", type: "date" },
  { id: "status", label: "Status", type: "string" },
] as const // 'as const' ensures type safety for field IDs

/**
 * Type definition for the ID of a client field, derived from `clientFields`.
 */
export type ClientFieldId = (typeof clientFields)[number]["id"]
