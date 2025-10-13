"use server";

import { db } from "@/db/index";
import { notesTable } from "@/db/schema/notes";
import { eq } from "drizzle-orm";

export async function deleteNote(noteId: string) {
  try {
    await db.delete(notesTable).where(eq(notesTable.id, noteId));
    return { success: true };
  } catch (error) {
    throw new Error("Falha ao deletar nota");
  }
}
