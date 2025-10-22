"use client"

import { useState } from "react"
import { FileIcon, AlertCircle } from "lucide-react"
import DropdownFile from "./dropdown-file"
import { InlineTitleEdit } from "./inline-title-edit"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useNotesStore } from "@/stores/notes-store"
import { Note } from "@/actions/notes/type"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Componente para item sortable individual
function SortableNote({ 
  note, 
  isSelected, 
  isEditing,
  onSelect,
  onEditTitle,
  onSaveTitle,
  onCancelEdit,
  onDelete
}: {
  note: Note
  isSelected: boolean
  isEditing: boolean
  onSelect: () => void
  onEditTitle: () => void
  onSaveTitle: (newTitle: string) => void
  onCancelEdit: () => void
  onDelete: () => Promise<void>
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group min-h-[32px] text-sm px-3 w-full hover:bg-muted/50 rounded-md flex items-center text-foreground active:cursor-grabbing font-medium",
        isSelected && "bg-muted text-foreground font-semibold",
        isDragging && "opacity-50"
      )}
      onClick={onSelect}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onEditTitle()
      }}
    >
      {isEditing ? (
        <div className="flex items-center w-full">
          <FileIcon className="shrink-0 h-4 w-4 mr-2 text-muted-foreground" />
          <InlineTitleEdit
            title={note.title}
            onSave={onSaveTitle}
            onCancel={onCancelEdit}
            placeholder="Sem título"
            className="flex-1"
          />
        </div>
      ) : (
        <>
          <FileIcon className="shrink-0 h-4 w-4 mr-2 text-muted-foreground" />
          <span className="truncate flex-1 font-medium">{note.title || "Sem título"}</span>
          <div className="ml-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <DropdownFile 
              noteId={note.id}
              onDelete={onDelete}
              onEditTitle={onEditTitle}
            />
          </div>
        </>
      )}
    </div>
  )
}

interface NoteListProps {
  selectedNoteId?: string | null
  onSelectNote?: (noteId: string | null) => void
  notes?: Note[]
}

export function NoteList({ selectedNoteId, onSelectNote, notes: propNotes }: NoteListProps = {}) {
  const { notes: storeNotes, isLoading, error, hasInitialLoad, selectedNoteId: storeSelectedNoteId, setSelectedNoteId, updateNote, reorderNotes } = useNotesStore()
  
  const notes = propNotes || storeNotes
  const currentSelectedNoteId = selectedNoteId !== undefined ? selectedNoteId : storeSelectedNoteId
  const handleSelectNote = onSelectNote || setSelectedNoteId
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      reorderNotes(active.id as string, over?.id as string)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Spinner className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground ml-3 font-medium">Carregando notas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <AlertCircle className="h-5 w-5 text-destructive mr-3" />
        <span className="text-sm text-muted-foreground font-medium">{error}</span>
      </div>
    )
  }

  if (!isLoading && hasInitialLoad && notes.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <FileIcon className="h-5 w-5 text-muted-foreground mr-3" />
        <span className="text-sm text-muted-foreground font-medium">Nenhuma nota encontrada</span>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={notes.map(note => note.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {notes.map((note) => (
            <SortableNote
              key={note.id}
              note={note}
              isSelected={currentSelectedNoteId === note.id}
              isEditing={editingNoteId === note.id}
              onSelect={() => handleSelectNote(note.id)}
              onEditTitle={() => setEditingNoteId(note.id)}
              onSaveTitle={async (newTitle) => {
                await updateNote(note.id, { title: newTitle })
                setEditingNoteId(null)
              }}
              onCancelEdit={() => setEditingNoteId(null)}
              onDelete={async () => {
                if (currentSelectedNoteId === note.id) {
                  handleSelectNote(null)
                }
              }}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
