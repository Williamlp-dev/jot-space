"use client"

import { Plus } from "lucide-react"
import { createNote } from "@/actions/notes/create-note"
import { useNotesStore } from "@/stores/notes-store"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useState } from "react"
import { Spinner } from "./ui/spinner"

export default function NewNote() {
  const { fetchNotes } = useNotesStore()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateNote = async () => {
    if (isCreating) return
    
    setIsCreating(true)
    try {
      const newNote = await createNote({
        description: ""
      })
      await fetchNotes()
    } catch (error) {
      console.error("Erro ao criar nota:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <SidebarMenuButton 
      onClick={handleCreateNote}
      disabled={isCreating}
    >
      <div className="flex items-center gap-2">
        {isCreating ? (
          <>
            <Spinner className="h-4 w-4" />
            <span className="font-medium">Criando...</span>
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            <span className="font-medium">Nova Nota</span>
          </>
        )}
      </div>
    </SidebarMenuButton>
  )
}
