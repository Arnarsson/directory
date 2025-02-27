"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useFormState, useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { scrapeUrlAction } from "@/app/scraper/actions"

// Submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus()
  const { t } = useLanguage()
  
  return (
    <Button 
      type="submit" 
      className="w-full"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t("scraping")}
        </>
      ) : (
        t("scrapeUrl")
      )}
    </Button>
  )
}

export function ScraperForm() {
  const { t } = useLanguage()
  const router = useRouter()
  
  // Initialize form state with the scraper action
  const initialState = { message: "", success: false, issues: [] }
  const [state, formAction] = useFormState(scrapeUrlAction, initialState)

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{t("aiResourceScraper")}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
        {t("enterUrl")}
      </p>
      
      <form action={formAction} className="space-y-4">
        <div>
          <Input
            type="url"
            name="url"
            placeholder="https://example.com"
            className="w-full"
            required
          />
        </div>
        
        <SubmitButton />
      </form>
      
      {state.issues && state.issues.length > 0 && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md text-sm">
          {state.message}
          <ul className="list-disc pl-5 mt-2">
            {state.issues.map((issue: string, index: number) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      
      {state.success && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md text-sm">
          {state.message}
        </div>
      )}
      
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        <p>{t("scraperDescription")}</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Extract metadata from the URL</li>
          <li>Analyze the content to categorize the AI tool</li>
          <li>Generate appropriate tags and descriptions</li>
          <li>Submit for review before adding to the directory</li>
        </ul>
      </div>
    </div>
  )
}
