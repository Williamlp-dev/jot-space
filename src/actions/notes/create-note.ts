"use server";

import { db } from "@/db/index";
import { notesTable } from "@/db/schema/notes";
import { max } from "drizzle-orm";

export async function createNote(data: { title?: string; description?: string }) {
  try {
    // Busca o maior valor de order para adicionar nova nota no final
    const maxOrderResult = await db
      .select({ maxOrder: max(notesTable.order) })
      .from(notesTable);
    
    const nextOrder = maxOrderResult[0]?.maxOrder !== null 
      ? maxOrderResult[0].maxOrder + 100 
      : 100;
    
    const newNote = await db
      .insert(notesTable)
      .values({
        title: data.title || "Sem título",
        description: data.description ?? "",
        order: nextOrder,
      })
      .returning();
    
    return newNote[0];
  } catch (error) {
    console.error("Erro ao criar nota:", error);
    throw new Error("Falha ao criar nota");
  }
}
