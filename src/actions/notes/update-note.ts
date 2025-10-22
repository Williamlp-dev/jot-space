"use server";

import { db } from "@/db/index";
import { notesTable } from "@/db/schema/notes";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function updateNote(
  noteId: string, 
  updates: { title?: string; description?: string }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const updatedNote = await db
      .update(notesTable)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(notesTable.id, noteId),
          eq(notesTable.userId, session.user.id)
        )
      )
      .returning();
    
    if (!updatedNote[0]) {
      throw new Error("Nota não encontrada ou sem permissão");
    }
    
    return updatedNote[0];
  } catch (error) {
    console.error("Erro ao atualizar nota:", error);
    throw new Error("Falha ao atualizar nota");
  }
}
