"use client"

import { useEffect, useState } from "react"
import { FileText, Search } from "lucide-react"
import { NoteList } from "@/components/note-list"
import NewNote from "./new-note"
import { useNotesStore } from "@/stores/notes-store"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Separator } from "./ui/separator"
import { NavUser } from "./ui/nav-user"

interface AppSidebarProps {
  selectedNoteId?: string | null
  onSelectNote?: (noteId: string | null) => void
}

export function AppSidebar({ selectedNoteId, onSelectNote }: AppSidebarProps) {
  const { fetchNotes, notes } = useNotesStore()
  const [searchQuery, setSearchQuery] = useState("")
  
  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  // Filtrar notas baseado na busca
  const filteredNotes = notes.filter(note => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return note.title.toLowerCase().includes(query) ||
           (note.description && note.description.toLowerCase().includes(query))
  })

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-3 border-b">
        <div className="flex items-center gap-2">
          <NavUser />
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
        <Separator/>

        {/* Nova Nota */}
        <div className="p-3">
          <NewNote />
        </div>

        {/* Lista de Notas */}
        <div className="flex-1 px-3">
          <NoteList 
            selectedNoteId={selectedNoteId}
            onSelectNote={onSelectNote}
            notes={filteredNotes}
          />
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
