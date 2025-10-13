"use server";

import { db } from "@/db/index";
import { notesTable } from "@/db/schema/notes";
import { eq } from "drizzle-orm";

export async function updateNote(
  noteId: string, 
  updates: { title?: string; description?: string }
) {
  try {
    const updatedNote = await db
      .update(notesTable)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(notesTable.id, noteId))
      .returning();
    
    return updatedNote[0];
  } catch (error) {
    console.error("Erro ao atualizar nota:", error);
    throw new Error("Falha ao atualizar nota");
  }
}
