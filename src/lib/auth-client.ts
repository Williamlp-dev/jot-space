import { createAuthClient } from "better-auth/react"

function resolveBaseURL(): string {
  // Prefer the current browser origin to avoid mixed-content issues
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin
  }

  // Build-time/runtime fallbacks (only NEXT_PUBLIC_* is available on client)
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv.replace(/\/$/, "")
  }

  // Vercel provides VERCEL_URL (without scheme). If available at build time, use https
  // Note: This may be undefined in client bundles; safe due to guards above
  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl && vercelUrl.trim().length > 0) {
    const url = vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`
    return url.replace(/\/$/, "")
  }

  // Local fallback
  return "http://localhost:3000"
}

export const authClient =  createAuthClient({
  baseURL: resolveBaseURL(),
})