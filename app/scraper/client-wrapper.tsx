"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { ScraperForm } from "@/components/scraper-form"

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

export function ScraperClientWrapper() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()

  // In development mode, we'll bypass the authentication check
  const isAuthenticated = isDevelopment ? true : isSignedIn

  useEffect(() => {
    // Only redirect if not in development mode
    if (!isDevelopment && isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=" + encodeURIComponent(window.location.href))
    }
  }, [isLoaded, isSignedIn, router])

  // Show loading state while checking authentication
  if (!isLoaded && !isDevelopment) {
    return (
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
      </div>
    )
  }

  // Show sign-in prompt if not authenticated (and not in development mode)
  if (!isAuthenticated) {
    return (
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">{t("authRequired")}</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {t("signInRequired")}
        </p>
        <Button asChild className="button bg-primary-teal hover:bg-primary-light text-white dark:bg-secondary-coral dark:hover:bg-secondary-light dark:text-black">
          <a href="/sign-in">{t("signIn")}</a>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-primary-teal dark:text-secondary-coral">{t("aiResourceScraper")}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("automaticallyDiscover")}
        </p>
        {isDevelopment && (
          <div className="mt-2 text-sm bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-2 rounded-md inline-block">
            Development Mode: Authentication bypassed
          </div>
        )}
      </div>
      
      <ScraperForm />
      
      <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          {t("scraperDescription")}
        </p>
      </div>
    </>
  )
}
