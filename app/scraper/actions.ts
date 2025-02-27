"use server"

import "server-only"
import { revalidatePath } from "next/cache"
import { createClient } from "@/db/supabase/server"
import { createProduct } from "../submit/action"

// Define the form state type
export type ScraperFormState = {
  message: string
  success?: boolean
  issues?: string[]
}

// Helper function to format scraped data
function formatScrapedData(metadata: any): Record<string, string> {
  return {
    fullName: "Scraped from website",
    email: "scraped@example.com", // Placeholder
    twitterHandle: "@scraped", // Placeholder with a valid value
    productWebsite: metadata.url,
    codename: metadata.name,
    punchline: metadata.ogTitle || metadata.title || metadata.name,
    description: metadata.ogDescription || metadata.description || `AI tool scraped from ${metadata.url}`,
    categories: "AI Tools", // Default category
  }
}

// Helper function to check if an error has a message
function isErrorWithMessage(error: unknown): error is Error {
  return typeof error === "object" && error !== null && "message" in error
}

// Main scraper action
export async function scrapeUrlAction(
  prevState: ScraperFormState,
  formData: FormData
): Promise<ScraperFormState> {
  const url = formData.get("url") as string
  
  if (!url) {
    return {
      message: "Please enter a URL",
      success: false,
      issues: ["No URL provided"]
    }
  }
  
  try {
    // Validate URL format
    new URL(url)
    
    // Call our API route to scrape the website
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })
    
    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.error || "Failed to scrape URL")
    }
    
    const { metadata: scrapedMetadata } = responseData
    
    // Format the scraped data for product creation
    const metadata = formatScrapedData(scrapedMetadata)
    
    // Create the product using the imported function
    const productState = await createProduct(metadata)
    
    if (productState.message === "Tool submitted successfully") {
      revalidatePath("/", "page")
      return {
        message: "URL successfully scraped! The AI resource will be reviewed and added to our directory.",
        success: true
      }
    } else {
      return {
        message: "Failed to add scraped resource to directory",
        success: false,
        issues: productState.issues
      }
    }
  } catch (error) {
    console.error("Scraper error:", error)
    return {
      message: `Failed to scrape URL: ${error instanceof Error ? error.message : "Unknown error"}`,
      success: false,
      issues: [error instanceof Error ? error.message : "Unknown error"]
    }
  }
}
