"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { type ClientFieldId, clientFields } from "@/lib/data"
import type { SortCriterion } from "@/lib/sort-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, ArrowUpIcon, ArrowDownIcon, XIcon, GripVerticalIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortPanelProps {
  sortCriteria: SortCriterion[]
  onSortCriteriaChange: (criteria: SortCriterion[]) => void
}

interface SortableItemProps {
  criterion: SortCriterion
  onRemove: (id: string) => void
  onToggleDirection: (id: string) => void
}

/**
 * A single draggable and sortable item representing a sort criterion.
 * Handles drag-and-drop behavior, displays the field, and allows toggling sort direction and removal.
 *
 * @param {SortableItemProps} props - The component props.
 * @param {SortCriterion} props.criterion - The sort criterion object.
 * @param {(id: string) => void} props.onRemove - Callback to remove the criterion.
 * @param {(id: string) => void} props.onToggleDirection - Callback to toggle the sort direction.
 */
function SortableItem({ criterion, onRemove, onToggleDirection }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: criterion.id, // Unique ID for dnd-kit to track this item
  })

  // Apply transform and transition for smooth dragging and reordering animations
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Elevate the z-index of the dragging item to ensure it's above others
    zIndex: isDragging ? 10 : 0,
    // Add a subtle scale and shadow when dragging for better visual feedback
    boxShadow: isDragging ? "0 8px 16px rgba(0,0,0,0.15)" : "none",
    transformOrigin: "0 0", // Ensure scaling is from the top-left
  }

  // Find the human-readable label for the field ID
  const fieldLabel = clientFields.find((f) => f.id === criterion.field)?.label || criterion.field

  return (
    <Card
      ref={setNodeRef} // Ref for dnd-kit to attach to the DOM node
      style={style}
      className={cn(
        "flex items-center justify-between p-2 pr-4 border rounded-md transition-all duration-200 ease-in-out",
        isDragging && "ring-2 ring-primary ring-offset-2 bg-white dark:bg-gray-800", // Visual feedback when dragging
      )}
    >
      <CardContent className="flex items-center p-0 gap-2">
        {/* Drag handle button */}
        <Button
          variant="ghost"
          size="icon"
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
          {...attributes} // Attributes for accessibility and drag behavior
          {...listeners} // Event listeners for drag behavior
          aria-label="Drag to reorder sort criterion"
        >
          <GripVerticalIcon className="h-4 w-4" />
        </Button>
        {/* Display the field label */}
        <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{fieldLabel}</span>
        {/* Button to toggle sort direction */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleDirection(criterion.id)}
          className="ml-2 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={`Toggle sort direction for ${fieldLabel}`}
        >
          {criterion.direction === "asc" ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
        </Button>
      </CardContent>
      {/* Button to remove the sort criterion */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(criterion.id)}
        className="text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-300"
        aria-label={`Remove sort criterion for ${fieldLabel}`}
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </Card>
  )
}

/**
 * The main Sort Panel component.
 * Allows users to add, remove, reorder (drag-and-drop), and toggle direction of sort criteria.
 *
 * @param {SortPanelProps} props - The component props.
 * @param {SortCriterion[]} props.sortCriteria - The current array of sort criteria.
 * @param {(criteria: SortCriterion[]) => void} props.onSortCriteriaChange - Callback to update the sort criteria in the parent.
 */
export function SortPanel({ sortCriteria, onSortCriteriaChange }: SortPanelProps) {
  const [selectedField, setSelectedField] = useState<ClientFieldId | "">("")

  // Configure dnd-kit sensors for pointer (mouse/touch) and keyboard interactions
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  /**
   * Handles the end of a drag operation.
   * Reorders the sort criteria based on the drag-and-drop result.
   * @param {DragEndEvent} event - The drag end event object from dnd-kit.
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      // Only reorder if the item was dragged to a different position
      if (active.id !== over?.id) {
        const oldIndex = sortCriteria.findIndex((c) => c.id === active.id)
        const newIndex = sortCriteria.findIndex((c) => c.id === over?.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          const newCriteria = [...sortCriteria]
          // Remove the dragged item from its old position
          const [movedItem] = newCriteria.splice(oldIndex, 1)
          // Insert the dragged item into its new position
          newCriteria.splice(newIndex, 0, movedItem)
          onSortCriteriaChange(newCriteria) // Update parent state
        }
      }
    },
    [sortCriteria, onSortCriteriaChange],
  )

  /**
   * Adds a new sort criterion based on the currently selected field.
   * Prevents adding duplicate fields.
   */
  const handleAddField = useCallback(() => {
    // Ensure a field is selected and it's not already in the criteria list
    if (selectedField && !sortCriteria.some((c) => c.field === selectedField)) {
      const newCriterion: SortCriterion = {
        id: `sort-${Date.now()}-${selectedField}`, // Unique ID for the new criterion
        field: selectedField,
        direction: "asc", // Default to ascending
      }
      onSortCriteriaChange([...sortCriteria, newCriterion]) // Add to existing criteria
      setSelectedField("") // Reset the select input
    }
  }, [selectedField, sortCriteria, onSortCriteriaChange])

  /**
   * Removes a sort criterion by its unique ID.
   * @param {string} id - The unique ID of the criterion to remove.
   */
  const handleRemoveCriterion = useCallback(
    (id: string) => {
      onSortCriteriaChange(sortCriteria.filter((c) => c.id !== id)) // Filter out the removed criterion
    },
    [sortCriteria, onSortCriteriaChange],
  )

  /**
   * Toggles the sort direction (asc/desc) for a specific criterion.
   * @param {string} id - The unique ID of the criterion to toggle.
   */
  const handleToggleDirection = useCallback(
    (id: string) => {
      onSortCriteriaChange(
        sortCriteria.map((c) => (c.id === id ? { ...c, direction: c.direction === "asc" ? "desc" : "asc" } : c)),
      )
    },
    [sortCriteria, onSortCriteriaChange],
  )

  // Filter out fields that are already being used as sort criteria
  const availableFields = clientFields.filter((field) => !sortCriteria.some((c) => c.field === field.id))

  return (
    <Card className="p-4 space-y-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sort By</h3>
      <div className="flex items-center gap-2">
        {/* Select dropdown for adding new sort fields */}
        <Select onValueChange={(value: ClientFieldId) => setSelectedField(value)} value={selectedField}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {availableFields.length > 0 ? (
              availableFields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.label}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                No more fields to add
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {/* Button to add the selected field as a sort criterion */}
        <Button
          onClick={handleAddField}
          disabled={!selectedField || availableFields.length === 0}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusIcon className="h-4 w-4 mr-2" /> Add Sort
        </Button>
      </div>

      {sortCriteria.length > 0 ? (
        // DndContext provides the drag-and-drop capabilities
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {/* SortableContext manages the sortable items within the DndContext */}
          <SortableContext items={sortCriteria.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sortCriteria.map((criterion) => (
                // Each sort criterion is rendered as a SortableItem
                <SortableItem
                  key={criterion.id}
                  criterion={criterion}
                  onRemove={handleRemoveCriterion}
                  onToggleDirection={handleToggleDirection}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          No sort criteria added yet. Add a field to begin sorting.
        </p>
      )}
    </Card>
  )
}
