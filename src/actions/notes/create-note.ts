"use server";

import { db } from "@/db/index";
import { notesTable } from "@/db/schema/notes";
import { max, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createNote(data: { title?: string; description?: string }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const maxOrderResult = await db
      .select({ maxOrder: max(notesTable.order) })
      .from(notesTable)
      .where(eq(notesTable.userId, session.user.id));
    
    const nextOrder = maxOrderResult[0]?.maxOrder !== null 
      ? maxOrderResult[0].maxOrder + 100 
      : 100;
    
    const newNote = await db
      .insert(notesTable)
      .values({
        title: data.title || "Sem título",
        description: data.description ?? "",
        order: nextOrder,
        userId: session.user.id,
      })
      .returning();
    
    return newNote[0];
  } catch (error) {
    console.error("Erro ao criar nota:", error);
    throw new Error("Falha ao criar nota");
  }
}
