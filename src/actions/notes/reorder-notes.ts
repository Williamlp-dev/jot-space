"use server";

import { db } from "@/db/index";
import { notesTable } from "@/db/schema/notes";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function reorderNotes(notes: { id: string; order: number }[]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const updatePromises = notes.map(note => 
      db
        .update(notesTable)
        .set({ 
          order: note.order, 
          updatedAt: new Date() 
        })
        .where(
          and(
            eq(notesTable.id, note.id),
            eq(notesTable.userId, session.user.id)
          )
        )
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
