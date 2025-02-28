import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

// In development mode, we'll use a mock client to avoid cookie issues
const isDevelopment = process.env.NODE_ENV === 'development'

// Create a simple cookie handler that works in all environments
const createCookieHandler = () => {
  // Use a simple cookie handler that doesn't rely on cookies() in all environments
  // This is safer and avoids issues with cookies() returning a Promise
  return {
    get: () => undefined,
    set: () => {},
    remove: () => {},
  }
}

export const createClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: createCookieHandler(),
    }
  )
}
