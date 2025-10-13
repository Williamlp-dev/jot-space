import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Note } from '@/actions/notes/type'
import { getNoteList } from '@/actions/notes/get-note-list'
import { updateNote } from '@/actions/notes/update-note'
import { reorderNotes } from '@/actions/notes/reorder-notes'

interface NotesStore {
  notes: Note[]
  selectedNoteId: string | null
  isLoading: boolean
  error: string | null
  hasInitialLoad: boolean
  
  setNotes: (notes: Note[]) => void
  setSelectedNoteId: (id: string | null) => void
  updateNoteOptimistic: (id: string, updates: Partial<Note>) => void
  fetchNotes: () => Promise<void>
  updateNote: (id: string, updates: { title?: string; description?: string }) => Promise<void>
  reorderNotes: (activeId: string, overId: string) => void
  deleteNoteOptimistic: (id: string) => void
}

export const useNotesStore = create<NotesStore>()(
  devtools(
    (set, get) => ({
      notes: [],
      selectedNoteId: null,
      isLoading: false,
      error: null,
      hasInitialLoad: false,

      setNotes: (notes) => set({ notes }),
      
      setSelectedNoteId: (id) => set({ selectedNoteId: id }),
      
      updateNoteOptimistic: (id, updates) => {
        set((state) => ({
          notes: state.notes.map(note =>
            note.id === id 
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          )
        }))
      },

      fetchNotes: async () => {
        set({ isLoading: true, error: null })
        try {
          const notes = await getNoteList()
          set({ notes, isLoading: false, hasInitialLoad: true })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro ao carregar notas',
            isLoading: false,
            hasInitialLoad: true
          })
        }
      },

      updateNote: async (id, updates) => {
        get().updateNoteOptimistic(id, updates)
        
        try {
          await updateNote(id, updates)
        } catch (error) {
          console.error('Erro ao atualizar nota:', error)
          await get().fetchNotes()
        }
      },

      reorderNotes: async (activeId, overId) => {
        const state = get()
        const activeIndex = state.notes.findIndex(note => note.id === activeId)
        const overIndex = state.notes.findIndex(note => note.id === overId)
        
        if (activeIndex === -1 || overIndex === -1) return
        
        const newNotes = [...state.notes]
        const [movedNote] = newNotes.splice(activeIndex, 1)
        newNotes.splice(overIndex, 0, movedNote)
        
        const updatedNotes = newNotes.map((note, index) => ({
          ...note,
          order: (index + 1) * 100
        }))
        
        set({ notes: updatedNotes })
        
        try {
          const result = await reorderNotes(
            updatedNotes.map(note => ({ id: note.id, order: note.order }))
          )
          
          if (!result.success) {
            throw new Error(result.error)
          }
        } catch (error) {
          console.error('Erro ao atualizar ordem das notas:', error)
          await get().fetchNotes()
        }
      },

      deleteNoteOptimistic: (id) => {
        set((state) => ({
          notes: state.notes.filter(note => note.id !== id),
          selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId
        }))
      }
    }),
    { name: 'notes-store' }
  )
)
