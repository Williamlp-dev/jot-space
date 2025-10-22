"use server";

import { db } from "@/db/index";
import { notesTable } from "@/db/schema/notes";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getNoteList() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const notes = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.userId, session.user.id))
      .orderBy(notesTable.order);
    
    return notes;
  } catch (error) {
    throw new Error("Falha ao buscar notas");
  }
}
