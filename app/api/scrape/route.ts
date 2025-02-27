import { NextRequest, NextResponse } from "next/server"

interface ScrapedMetadata {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  url: string
  domain: string
  name: string
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      )
    }
    
    // Validate URL format
    try {
      new URL(url)
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      )
    }
    
    const metadata = await scrapeWebsite(url)
    
    return NextResponse.json({ metadata })
  } catch (error) {
    console.error("Scraper API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

async function scrapeWebsite(url: string): Promise<ScrapedMetadata> {
  try {
    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.85 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`)
    }
    
    const html = await response.text()
    
    // Extract metadata using regex
    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i)
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i)
    const ogDescriptionMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i)
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i)
    
    // Extract domain name for the codename
    const domain = new URL(url).hostname.replace("www.", "")
    const domainParts = domain.split(".")
    const name = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1)
    
    return {
      title: titleMatch?.[1] || "",
      description: descriptionMatch?.[1] || "",
      ogTitle: ogTitleMatch?.[1] || "",
      ogDescription: ogDescriptionMatch?.[1] || "",
      ogImage: ogImageMatch?.[1] || "",
      url,
      domain,
      name,
    }
  } catch (error) {
    console.error("Error scraping website:", error)
    throw error
  }
}
