"use client"

import type { Client } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { motion } from "framer-motion" // Import motion for animations

interface ClientTableProps {
  clients: Client[]
}

/**
 * Renders a table displaying client data.
 * Includes subtle fade-in animations for rows using Framer Motion.
 *
 * @param {ClientTableProps} props - The component props.
 * @param {Client[]} props.clients - An array of client objects to display.
 */
export function ClientTable({ clients }: ClientTableProps) {
  // Framer Motion variants for row animation
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  }

  return (
    <div className="rounded-md border overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Name</TableHead>
            <TableHead className="w-[200px]">Email</TableHead>
            <TableHead className="w-[180px]">Created At</TableHead>
            <TableHead className="w-[180px]">Updated At</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client, index) => (
              // Use motion.tr for animated table rows
              <motion.tr
                key={client.id}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                transition={{ delay: index * 0.05 }} // Stagger animation for each row
                className="hover:bg-gray-50 data-[state=selected]:bg-gray-50"
              >
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{format(client.createdAt, "MMM dd, yyyy HH:mm")}</TableCell>
                <TableCell>{format(client.updatedAt, "MMM dd, yyyy HH:mm")}</TableCell>
                <TableCell>
                  {/* Status badge with dynamic styling */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors duration-200 ${
                      client.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : client.status === "inactive"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : client.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                </TableCell>
              </motion.tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No clients found matching the criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
