"use client"

import { useEffect, useState, useMemo } from "react"
import { generateMockClients, type Client } from "@/lib/data"
import { applyMultiSort, type SortCriterion } from "@/lib/sort-utils"
import { ClientTable } from "@/components/client-table"
import { SortPanel } from "@/components/sort-panel"
import { Footer } from "@/components/footer" // Import the new Footer component

// Constants for the number of clients and local storage key
const CLIENT_COUNT = 20
const LOCAL_STORAGE_KEY = "clientSortCriteria"

/**
 * The main application page component.
 * Manages client data, sorting criteria, and renders the UI.
 */
export default function Home() {
  // State to hold the mock client data. Initialized once.
  const [clients] = useState<Client[]>(generateMockClients(CLIENT_COUNT))
  // State to hold the current sorting criteria.
  const [sortCriteria, setSortCriteria] = useState<SortCriterion[]>([])

  /**
   * Effect hook to load sort criteria from localStorage on initial component mount.
   * This ensures that the user's last sorting preferences are restored.
   */
  useEffect(() => {
    // Ensure window is defined (client-side execution) before accessing localStorage
    if (typeof window !== "undefined") {
      const savedCriteria = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (savedCriteria) {
        try {
          // Attempt to parse the saved JSON string
          const parsedCriteria: SortCriterion[] = JSON.parse(savedCriteria)
          // Validate parsed criteria to ensure it's an array and contains expected properties
          if (Array.isArray(parsedCriteria) && parsedCriteria.every((c) => c.id && c.field && c.direction)) {
            setSortCriteria(parsedCriteria)
          } else {
            console.warn("Invalid sort criteria found in localStorage. Clearing it.")
            localStorage.removeItem(LOCAL_STORAGE_KEY)
          }
        } catch (error) {
          // Log any parsing errors and clear corrupted data from localStorage
          console.error("Failed to parse sort criteria from localStorage:", error)
          localStorage.removeItem(LOCAL_STORAGE_KEY) // Clear invalid data
        }
      }
    }
  }, []) // Empty dependency array ensures this runs only once on mount

  /**
   * Effect hook to save sort criteria to localStorage whenever it changes.
   * This persists the user's sorting preferences.
   */
  useEffect(() => {
    // Ensure window is defined (client-side execution) before accessing localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sortCriteria))
    }
  }, [sortCriteria]) // Re-run this effect whenever sortCriteria changes

  /**
   * Memoized computation for the sorted clients array.
   * This prevents re-sorting the clients unnecessarily on every render,
   * only re-sorting when the original `clients` data or `sortCriteria` change.
   */
  const sortedClients = useMemo(() => {
    return applyMultiSort(clients, sortCriteria)
  }, [clients, sortCriteria]) // Dependencies for memoization

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <main className="flex-grow flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-6xl space-y-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-900 dark:text-gray-100">
            Client List Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sort Panel section */}
            <div className="md:col-span-1">
              <SortPanel sortCriteria={sortCriteria} onSortCriteriaChange={setSortCriteria} />
            </div>
            {/* Client Table section */}
            <div className="md:col-span-3">
              <ClientTable clients={sortedClients} />
            </div>
          </div>
        </div>
      </main>
      {/* Footer component */}
      <Footer />
    </div>
  )
}
