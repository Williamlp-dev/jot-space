"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"

type User = NonNullable<Awaited<ReturnType<typeof authClient.getSession>>['data']>['user']

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession()
        if (session.data?.user) {
          setUser(session.data.user)
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  return { user, loading }
}
