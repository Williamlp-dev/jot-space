import { NotesLayout } from "@/components/notes-layout"
import { NotesClient } from "@/components/notes-client"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function NotesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/signin")
  }

  return (
    <NotesLayout>
      <NotesClient />
    </NotesLayout>
  )
}
