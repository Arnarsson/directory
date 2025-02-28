"use server"

import "server-only"
import { revalidatePath } from "next/cache"
import { createClient } from "@/db/supabase/server"
import { createProduct } from "../submit/action"
import { addScrapedProduct } from "../actions/product"
import { ScrapedMetadata } from "@/lib/scraper"

// Define the form state type
export type ScraperFormState = {
  message: string
  success?: boolean
  issues?: string[]
  metadata?: ScrapedMetadata
}

// Helper function to format scraped data
function formatScrapedData(metadata: ScrapedMetadata): Record<string, string> {
  // Get the original language content
  const title = metadata.title.original || '';
  const description = metadata.description.original || '';
  const ogTitle = metadata.ogTitle?.original || '';
  const ogDescription = metadata.ogDescription?.original || '';
  
  // Get the generated content
  const summary = metadata.generatedContent?.summary.original || '';
  
  // Extract tags and categories
  const tags = metadata.tags.join(', ');
  const categories = metadata.categories.join(', ');
  
  // Determine pricing status
  const isPaid = metadata.pricing?.isFree ? 'Free' : 'Paid';
  
  return {
    fullName: "Scraped from website",
    email: "scraped@example.com", // Placeholder
    twitterHandle: "@scraped", // Placeholder with a valid value
    productWebsite: metadata.url,
    codename: metadata.name,
    punchline: ogTitle || title || metadata.name,
    description: ogDescription || description || summary || `AI tool scraped from ${metadata.url}`,
    categories: categories || "AI Tools", // Use detected categories or default
    tags: tags, // Include detected tags
    pricing: isPaid, // Include pricing information
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
  const language = formData.get("language") as string || "original"
  
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
    // Dynamically determine the API URL based on the current environment
    let apiUrl;
    
    if (typeof window !== 'undefined') {
      // Client-side: Use the current window location
      const protocol = window.location.protocol;
      const host = window.location.host;
      apiUrl = `${protocol}//${host}/api/scrape`;
    } else {
      // Server-side: Use environment variables or default
      const currentPort = process.env.PORT || "3000";
      apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${currentPort}`}/api/scrape`;
    }
    
    console.log("Calling API endpoint:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, language }),
    })
    
    // Check if the response is JSON before trying to parse it
    const contentType = response.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      const textResponse = await response.text()
      throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`)
    }
    
    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.error || "Failed to scrape URL")
    }
    
    const { metadata: scrapedMetadata } = responseData
    
    // Format the scraped data for product creation
    const metadata = formatScrapedData(scrapedMetadata)
    
    // Create the product using the imported function
    const productState = await createProduct(metadata)
    
    // Also add the product to the mock products array for immediate display
    const productId = await addScrapedProduct({
      full_name: metadata.fullName,
      email: metadata.email,
      twitter_handle: metadata.twitterHandle,
      product_website: metadata.productWebsite,
      codename: metadata.codename,
      punchline: metadata.punchline,
      description: metadata.description,
      categories: metadata.categories,
      tags: metadata.tags,
      labels: [metadata.pricing]
    })
    
    if (productState.message === "Tool submitted successfully") {
      // Revalidate both the home page and products page
      revalidatePath("/", "page")
      revalidatePath("/products", "page")
      
      return {
        message: `URL successfully scraped! The AI resource has been added to our directory. <a href="/products/${productId}" class="text-blue-500 hover:underline">View it here</a>`,
        success: true,
        metadata: scrapedMetadata
      }
    } else {
      return {
        message: "Failed to add scraped resource to directory",
        success: false,
        issues: productState.issues,
        metadata: scrapedMetadata
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
