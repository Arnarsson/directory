import { Metadata } from "next"

import { NavSidebar } from "@/components/nav"
import { getCachedFilters } from "../actions/cached_actions"
import { ScraperClientWrapper } from "./client-wrapper"

export const metadata: Metadata = {
  title: "AI Resource Scraper - Ethos AI",
  description: "Automatically scrape and add AI tools and resources to our directory",
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

      <div className="max-w-full px-2 md:pl-4 md:pr-0 pt-2">
        <div className="flex flex-col items-center justify-center min-h-[80vh] md:ml-[12rem]">
          <div className="w-full max-w-2xl">
            <ScraperClientWrapper />
          </div>
        </div>
      </div>
    </>
  )
}
