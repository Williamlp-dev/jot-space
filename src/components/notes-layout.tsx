"use client"

import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useNotesStore } from "@/stores/notes-store"

interface NotesLayoutProps {
  children: React.ReactNode
}

export function NotesLayout({ children }: NotesLayoutProps) {
  const { selectedNoteId, setSelectedNoteId } = useNotesStore()

  return (
    <SidebarProvider>
      <AppSidebar 
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
      />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
