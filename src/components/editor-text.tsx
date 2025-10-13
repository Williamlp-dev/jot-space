"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { BoldToolbar } from "@/components/toolbars/bold"
import { ItalicToolbar } from "@/components/toolbars/italic"
import { BulletListToolbar } from "@/components/toolbars/bullet-list"
import { OrderedListToolbar } from "@/components/toolbars/ordered-list"
import { UndoToolbar } from "@/components/toolbars/undo"
import { RedoToolbar } from "@/components/toolbars/redo"
import { ToolbarProvider } from "@/components/toolbars/toolbar-provider"
import { EditorContent, type Extension, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { InlineTitleEdit } from "./inline-title-edit"
import { Note } from "@/actions/notes/type"
import { cn } from "@/lib/utils"
import { useNotesStore } from "@/stores/notes-store"
import { Spinner } from "./ui/spinner"
import { CodeToolbar } from "./toolbars/code"
import { CodeBlockToolbar } from "./toolbars/code-block"

// Memoizar extensões para evitar recriação desnecessária
const createExtensions = (): Extension[] => [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    heading: {
      levels: [1, 2, 3],
      HTMLAttributes: {
        class: "font-semibold",
      },
    },
  }),
]

interface EditorTextProps {
  note: Note | null
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function EditorText({ note }: EditorTextProps) {
  const [hasChanges, setHasChanges] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null)
  const { updateNote } = useNotesStore()

  // Memoizar extensões para evitar recriação desnecessária
  const extensions = useMemo(() => createExtensions(), [])

  const editor = useEditor({
    extensions,
    content: note?.description || "",
    immediatelyRender: false,
    onUpdate: () => {
      setHasChanges(true)
      setSaveStatus('idle')
    
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout)
      }
      
      const timeout = setTimeout(() => {
        handleAutoSave()
      }, 2000)
      
      setAutoSaveTimeout(timeout)
    },
  })

  const handleAutoSave = useCallback(async () => {
    if (note && editor && hasChanges) {
      setSaveStatus('saving')
      try {
        await updateNote(note.id, { description: editor.getHTML() })
        setHasChanges(false)
        setSaveStatus('saved')
        
        // Reset status after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (error) {
        console.error('Erro no auto-save:', error)
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    }
  }, [note, editor, hasChanges, updateNote])


  const handleTitleSave = useCallback(async (newTitle: string) => {
    if (note) {
      const trimmedTitle = newTitle.trim()
      if (trimmedTitle === "") {
        await updateNote(note.id, { title: "Sem título" })
      } else if (trimmedTitle !== note.title) {
        await updateNote(note.id, { title: trimmedTitle })
      }
    }
    setIsEditingTitle(false)
  }, [note, updateNote])

  const handleTitleCancel = useCallback(() => {
    setIsEditingTitle(false)
  }, [])
    
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout)
      }
    }
  }, [autoSaveTimeout])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditingTitle) {
        handleTitleCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isEditingTitle, handleTitleCancel])

  useEffect(() => {
    if (editor && note) {
      editor.commands.setContent(note.description || "")
      setHasChanges(false)
      setSaveStatus('idle')
    }
  }, [editor, note])

  // Função para renderizar o status de salvamento
  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <Badge variant="secondary" className="text-muted-foreground">
            <Spinner/>
            Salvando...
          </Badge>
        )
      case 'saved':
        return (
          <Badge variant="secondary">
            <CheckCircle />
            Salvo
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="destructive">
            <AlertCircle />
            Erro ao salvar
          </Badge>
        )
      default:
        return null
    }
  }


  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
            Selecione uma nota
          </h2>
          <p className="text-muted-foreground">
            Escolha uma nota da lista para começar a editar
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b p-4">
        {isEditingTitle ? (
          <InlineTitleEdit
            title={note.title}
            onSave={handleTitleSave}
            onCancel={handleTitleCancel}
            placeholder="Sem título"
            className="text-2xl font-semibold"
          />
        ) : (
          <h1
            className={cn(
              "text-2xl font-semibold p-4 cursor-pointer hover:bg-accent/50 -m-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              (!note.title || note.title === "Sem título") && "text-muted-foreground"
            )}
            onClick={() => setIsEditingTitle(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setIsEditingTitle(true)
              }
            }}
            title="Clique para editar o título"
            tabIndex={0}
            role="button"
            aria-label={`Editar título: ${note.title || "Sem título"}`}
          >
            {note.title || "Sem título"}
          </h1>
        )}
      </div>

      {/* Editor de Conteúdo */}
      <div className="flex-1 flex p-4 flex-col">
        {editor && (
          <div className="border w-full relative rounded-md overflow-hidden flex-1 flex flex-col">
            <div className="flex w-full items-center py-2 px-3 justify-between border-b sticky top-0 left-0 bg-background z-20">
              <ToolbarProvider editor={editor}>
                <div className="flex items-center gap-1 overflow-x-auto">
                  <UndoToolbar />
                  <RedoToolbar />
                  <Separator orientation="vertical" className="h-6 flex-shrink-0" />
                  <BoldToolbar />
                  <ItalicToolbar />
                  <Separator orientation="vertical" className="h-6 flex-shrink-0" />
                  <BulletListToolbar />
                  <OrderedListToolbar />
                  <Separator orientation="vertical" className="h-6 flex-shrink-0" />
                  <CodeToolbar />
                  <CodeBlockToolbar />
                </div>
              </ToolbarProvider>
              
              <div className="flex items-center gap-3 ml-4">
                {renderSaveStatus()}
              </div>
            </div>
            <div
              onClick={() => {
                editor?.chain().focus().run()
              }}
              className="cursor-text flex-1 bg-background p-4 rounded-sm"
              role="textbox"
              aria-label="Editor de texto da nota"
              tabIndex={-1}
            >
              <EditorContent 
                className="outline-none min-h-[400px] prose prose-sm max-w-none" 
                editor={editor}
                aria-label="Conteúdo da nota"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}