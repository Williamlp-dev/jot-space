"use client"

import { EditorText } from "@/components/editor-text"
import { useNotesStore } from "@/stores/notes-store"

export function NotesClient() {
  const { notes, selectedNoteId } = useNotesStore()
  
  const selectedNote = notes.find(note => note.id === selectedNoteId) || null

  return (
    <div className="h-full w-full">
      <EditorText 
        note={selectedNote}
      />
    </div>
  )
}
