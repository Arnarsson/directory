"use client"

import React, { Suspense } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { FeaturedExternalLink, ProductLink } from "./directory-product-card"

interface Product {
  id: string
  created_at: string
  full_name: string
  email: string
  twitter_handle: string
  product_website: string
  codename: string
  punchline: string
  description: string
  logo_src: string
  user_id: string
  tags: string[]
  view_count: number
  approved: boolean
  labels: string[]
  categories: string
}

export interface SEOCardGridProps {
  sortedData: Product[]
  filteredFeaturedData: Product[] | null
  children?: React.ReactNode
}

export const ResourceCardGrid: React.FC<SEOCardGridProps> = ({
  sortedData,
  children,
}) => {
  const pathname = usePathname()
  return (
    <div className="flex flex-col md:items-start gap-6 overflow-hidden pb-8 md:mx-4 mx-0 md:ml-[12rem] lg:ml-[12rem] relative">
      <div
        className={cn(
          "px-4",
          pathname.includes("/products")
            ? "md:p-4 md:gap-3"
            : "bg-white p-6 gap-4 dark:bg-[#1E1E1E] shadow-[0_0_0_1px_rgba(42,157,143,0.1)_inset,0_0.5px_0.5px_rgba(42,157,143,0.05)_inset,0_-0.5px_0.5px_rgba(42,157,143,0.05)_inset,0_1px_2px_rgba(42,157,143,0.1)] dark:shadow-[0_0_0_0.5px_rgba(231,111,81,0.06)_inset,0_0.5px_0.5px_rgba(231,111,81,0.1)_inset,0_-0.5px_0.5px_rgba(231,111,81,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]",
            "backdrop-blur-sm transition-all duration-300 ease-in-out"
        )}
      >
        {children}
      </div>

      <div
        className={cn(
          "p-6 w-full",
          pathname.includes("/products")
            ? ""
            : "bg-white dark:bg-[#1E1E1E] shadow-[0_0_0_1px_rgba(42,157,143,0.1)_inset,0_0.5px_0.5px_rgba(42,157,143,0.05)_inset,0_-0.5px_0.5px_rgba(42,157,143,0.05)_inset,0_1px_2px_rgba(42,157,143,0.1)] dark:shadow-[0_0_0_0.5px_rgba(231,111,81,0.06)_inset,0_0.5px_0.5px_rgba(231,111,81,0.1)_inset,0_-0.5px_0.5px_rgba(231,111,81,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]",
            "backdrop-blur-sm transition-all duration-300 ease-in-out"
        )}
      >
        <Suspense fallback={
          <div className="w-full h-40 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-primary-teal/20 dark:border-secondary-coral/20 border-t-primary-teal dark:border-t-secondary-coral rounded-full animate-spin"></div>
            <p className="text-sm text-primary-teal/70 dark:text-secondary-coral/70 animate-pulse">Loading resources...</p>
          </div>
        }>
          <div key="tailwind-grid" className="relative">
            <TailwindMasonryGrid filteredData={sortedData} />
          </div>
        </Suspense>
      </div>
    </div>
  )
}

interface TailwindMasonryGridProps {
  filteredData: Product[]
}

const TailwindMasonryGrid: React.FC<TailwindMasonryGridProps> = ({
  filteredData,
}) => {
  return (
    <div className="flex justify-center w-full">
      {filteredData.length > 0 ? (
        <div className="gap-6 w-full">
          <div className="columns-1 lg:columns-2 xl:columns-3 2xl:columns-4 3xl:columns-4 space-y-6 w-full">
            {filteredData.map((data, index) => (
              <div 
                key={`main-${index}-${data.id}`}
                className="break-inside-avoid transform transition-transform duration-300 hover:scale-[1.01]"
              >
                <ProductLink data={data} order={index} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4 text-primary-teal/30 dark:text-secondary-coral/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-primary-teal dark:text-secondary-coral text-xl font-medium">No items found</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">Try adjusting your filters or search criteria to find what you're looking for</p>
            <button 
              onClick={() => window.history.back()} 
              className="mt-6 px-4 py-2 bg-primary-teal/10 dark:bg-secondary-coral/10 text-primary-teal dark:text-secondary-coral hover:bg-primary-teal/20 dark:hover:bg-secondary-coral/20 transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export const FeaturedGrid: React.FC<{ featuredData: Product[] }> = ({
  featuredData,
}) => {
  return (
    <div className="w-full mx-auto max-w-7xl bg-gradient-to-br from-primary-teal/5 to-primary-light/5 dark:from-secondary-coral/5 dark:to-secondary-light/5 border border-dashed border-primary-teal/20 dark:border-secondary-coral/20 py-6 px-4 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-primary-teal dark:text-secondary-coral flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        Featured Resources
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {featuredData.map((data, index) => (
          <div 
            key={`featured-${index}-${data.id}`} 
            className="transform transition-transform duration-300 hover:scale-[1.03]"
          >
            <FeaturedExternalLink trim={true} data={data} order={index} />
          </div>
        ))}
      </div>
    </div>
  )
}

export const EmptyFeaturedGrid = () => {
  const emptyData = [
    {
      codename: "Explore Ethos AI",
      punchline: "Discover Top AI Tools & Resources",
      product_website: "https://ethos-ai.cc",
      description:
        "Explore our curated collection of AI tools and resources to enhance your workflow",
      logo_src: "/ad-placeholder-metrics.png",
      tags: ["featured"],
      labels: ["featured-ad"],
    },
    {
      codename: "AI-Powered Dashboard",
      product_website: "https://ethos-ai.cc",
      punchline: "Analyze & Track AI Tools",
      description:
        "Access our premium dashboard to track and analyze the latest AI tools and trends",
      logo_src: "/ad-placeholder-1.png",
      tags: ["featured"],
      labels: ["featured-ad"],
    },
    {
      codename: "AI Scraper Tools",
      product_website: "https://ethos-ai.cc",
      punchline: "Automated AI Resource Discovery",
      description:
        "Our advanced scraper tools automatically discover and categorize new AI resources",
      logo_src: "/ad-placeholder-tags.png",
      tags: ["featured"],
      labels: ["featured-ad"],
    },
  ]

  return (
    <div className="w-full mx-auto max-w-7xl bg-gradient-to-br from-primary-teal/5 to-primary-light/5 dark:from-secondary-coral/5 dark:to-secondary-light/5 border border-dashed border-primary-teal/20 dark:border-secondary-coral/20 py-6 px-4 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-primary-teal dark:text-secondary-coral flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        Featured Resources
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {emptyData.map((data, index) => (
          <div 
            key={`featured-${index}-${data.codename}`} 
            className="md:py-0 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
          >
            {/* @ts-expect-error */}
            <FeaturedExternalLink trim={true} data={data} order={index} />
          </div>
        ))}
      </div>
    </div>
  )
}
