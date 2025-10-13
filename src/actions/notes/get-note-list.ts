"use server";

import { db } from "@/db/index";
import { notesTable } from "@/db/schema/notes";

export async function getNoteList() {
  try {
    const notes = await db.select().from(notesTable).orderBy(notesTable.order);
    return notes;
  } catch (error) {
    throw new Error("Falha ao buscar notas");
  }
}
