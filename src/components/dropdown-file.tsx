"use client"

import { useState } from "react"
import { Edit, EllipsisIcon, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteNote } from "@/actions/notes/delete-note"
import { useNotesStore } from "@/stores/notes-store"

interface DropdownFileProps {
  noteId: string
  onDelete?: () => Promise<void>
  onEditTitle?: () => void
}

export default function DropdownFile({ noteId, onDelete, onEditTitle }: DropdownFileProps) {
  const { deleteNoteOptimistic } = useNotesStore()
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleDelete = async () => {
    setIsDeleting(true)
    // Atualização otimista - remove da lista imediatamente
    deleteNoteOptimistic(noteId)
    
    try {
      await deleteNote(noteId)
      await onDelete?.()
    } catch (error) {
      console.error("Erro ao deletar nota:", error)
      alert("Erro ao deletar nota")
      // Em caso de erro, recarrega a lista para reverter
      window.location.reload()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full shadow-none"
            aria-label="Open edit menu"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[60]">
          <DropdownMenuItem onClick={onEditTitle}>
            <Edit className="mr-2 h-4 w-4" />Editar Título
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem 
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AlertDialogContent className="z-[70]">
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar Nota</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar esta nota? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deletando..." : "Deletar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
