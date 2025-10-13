"use server";

import { db } from "@/db/index";
import { notesTable } from "@/db/schema/notes";
import { eq } from "drizzle-orm";

export async function reorderNotes(notes: { id: string; order: number }[]) {
  try {
    const updatePromises = notes.map(note => 
      db
        .update(notesTable)
        .set({ 
          order: note.order, 
          updatedAt: new Date() 
        })
        .where(eq(notesTable.id, note.id))
    );
    
    await Promise.all(updatePromises);
    return { success: true };
  } catch (error) {
    console.error("Erro ao reordenar notas:", error);
    return { 
      success: false, 
      error: "Falha ao reordenar notas" 
    };
  }
}
