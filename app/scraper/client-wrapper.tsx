"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { ScraperForm } from "@/components/scraper-form"

export function ScraperClientWrapper() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=" + encodeURIComponent(window.location.href))
    }
  }, [isLoaded, isSignedIn, router])

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
      </div>
    )
  }

  // Show sign-in prompt if not authenticated
  if (!isSignedIn) {
    return (
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">{t("authRequired")}</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {t("signInRequired")}
        </p>
        <Button asChild className="button">
          <a href="/sign-in">{t("signIn")}</a>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">{t("aiResourceScraper")}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("automaticallyDiscover")}
        </p>
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
