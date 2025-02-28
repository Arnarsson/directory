import { NextRequest, NextResponse } from "next/server"
import { scrapeWebsite, ScrapedMetadata } from "@/lib/scraper"

export const dynamic = 'force-dynamic'; // Disable caching for this route

export async function POST(request: NextRequest) {
  console.log("API route called with request:", request.url);
  
  try {
    // Parse the request body as JSON
    let body;
    try {
      body = await request.json();
      console.log("Request body:", body);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { url, language = 'original' } = body;
    
    if (!url) {
      console.error("URL is required");
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Validate URL format
    try {
      new URL(url)
    } catch (error) {
      console.error("Invalid URL format:", url);
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    try {
      console.log("Scraping website:", url);
      // Use our enhanced scraper module
      const metadata = await scrapeWebsite(url)
      console.log("Scraping successful, returning metadata");
      
      // Return the response with appropriate content type
      return NextResponse.json(
        { 
          metadata,
          language,
          availableLanguages: ['original', 'danish'],
          cacheStatus: 'fresh'
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
          } 
        }
      )
    } catch (scrapeError) {
      console.error("Scraper error:", scrapeError)
      
      return NextResponse.json(
        { 
          error: scrapeError instanceof Error 
            ? scrapeError.message 
            : "Failed to scrape website" 
        },
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }
  } catch (error) {
    console.error("Scraper API error:", error)
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
