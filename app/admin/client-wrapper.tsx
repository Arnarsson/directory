"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

import { NavSidebar } from "@/components/nav"

export function AdminClientWrapper({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  // Show nothing while loading or if not signed in
  if (!isLoaded || !isSignedIn) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavSidebar />
      {children}
    </div>
  )
}
