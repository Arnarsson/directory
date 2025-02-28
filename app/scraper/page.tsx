import { Metadata } from "next"
import { Suspense } from "react"

import { NavSidebar } from "@/components/nav"
import { getCachedFilters } from "../actions/cached_actions"
import { ScraperClientWrapper } from "./client-wrapper"

export const metadata: Metadata = {
  title: "AI Resource Scraper - Ethos AI",
  description: "Automatically scrape and add AI tools and resources to our directory",
}

// Loading fallback for the suspense boundary
function ScraperLoading() {
  return (
    <div className="w-full max-w-2xl p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-primary-teal/10 dark:border-secondary-coral/10">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  )
}

export default async function ScraperPage() {
  // Get filters for the sidebar
  let filters = await getCachedFilters()

  return (
    <>
      <NavSidebar
        categories={filters.categories}
        labels={filters.labels}
        tags={filters.tags}
      />

      <div className="max-w-full px-2 md:pl-4 md:pr-0 pt-2 ml-48">
        <div className="flex flex-col items-center justify-center min-h-[80vh] md:ml-[12rem]">
          <div className="w-full max-w-2xl">
            {/* Wrap the client component in a suspense boundary */}
            <Suspense fallback={<ScraperLoading />}>
              <ScraperClientWrapper />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}
