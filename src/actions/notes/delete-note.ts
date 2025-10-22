"use server";

import { db } from "@/db/index";
import { notesTable } from "@/db/schema/notes";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function deleteNote(noteId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const result = await db
      .delete(notesTable)
      .where(
        and(
          eq(notesTable.id, noteId),
          eq(notesTable.userId, session.user.id)
        )
      )
      .returning();
    
    if (!result[0]) {
      throw new Error("Nota não encontrada ou sem permissão");
    }
    
    return { success: true };
  } catch (error) {
    throw new Error("Falha ao deletar nota");
  }
}
