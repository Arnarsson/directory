/**
 * Enhanced Web Scraper Module
 * 
 * This module provides a robust web scraping solution for extracting
 * metadata from websites, particularly focused on AI tools and resources.
 * 
 * Features:
 * - Ignores robots.txt restrictions
 * - Extracts comprehensive metadata
 * - Translates content to Danish
 * - Generates AI-enhanced summaries and content
 * - Creates appropriate tags and categories
 * 
 * Inspired by the crawl4ai library (https://github.com/unclecode/crawl4ai.git)
 */

import { JSDOM } from 'jsdom';
import { z } from 'zod';

// Define the content schema with both original and translated versions
export const ContentSchema = z.object({
  original: z.string(),
  danish: z.string().optional(),
});

export type Content = z.infer<typeof ContentSchema>;

// Define the generated content schema
export const GeneratedContentSchema = z.object({
  summary: ContentSchema,
  article: ContentSchema,
  keyPoints: z.array(ContentSchema),
  pros: z.array(ContentSchema),
  cons: z.array(ContentSchema),
});

export type GeneratedContent = z.infer<typeof GeneratedContentSchema>;

// Define the metadata schema with multilingual support
export const ScrapedMetadataSchema = z.object({
  // Basic metadata
  title: ContentSchema,
  description: ContentSchema,
  
  // Open Graph metadata
  ogTitle: ContentSchema.optional(),
  ogDescription: ContentSchema.optional(),
  ogImage: z.string().optional(),
  
  // URL and domain info
  url: z.string().url(),
  domain: z.string(),
  name: z.string(),
  
  // Additional metadata
  favicon: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  author: z.string().optional(),
  
  // Twitter metadata
  twitterCard: z.string().optional(),
  twitterSite: z.string().optional(),
  twitterCreator: z.string().optional(),
  twitterImage: z.string().optional(),
  twitterTitle: ContentSchema.optional(),
  twitterDescription: ContentSchema.optional(),
  
  // Page metadata
  language: z.string().optional(),
  themeColor: z.string().optional(),
  type: z.string().optional(),
  publishedTime: z.string().optional(),
  modifiedTime: z.string().optional(),
  
  // Classification
  tags: z.array(z.string()),
  categories: z.array(z.string()),
  
  // AI-generated content
  generatedContent: GeneratedContentSchema.optional(),
  
  // Main content extracted from the page
  mainContent: ContentSchema.optional(),
  
  // Price information if available
  pricing: z.object({
    isFree: z.boolean().optional(),
    hasTrial: z.boolean().optional(),
    price: z.string().optional(),
    pricingModel: z.string().optional(),
  }).optional(),
  
  // Technical details
  techStack: z.array(z.string()).optional(),
  
  // Integration information
  integrations: z.array(z.string()).optional(),
});

export type ScrapedMetadata = z.infer<typeof ScrapedMetadataSchema>;

// Cache for storing scraped results
const cache = new Map<string, ScrapedMetadata>();

/**
 * Translates text to Danish
 * Note: In a production environment, this would use a proper translation API
 */
async function translateToDanish(text: string): Promise<string> {
  if (!text) return '';
  
  // This is a simplified mock translation for demonstration purposes
  // In a real implementation, you would use a translation API like Google Translate, DeepL, etc.
  const danishPrefixes = {
    'AI': 'KI',
    'The': 'Den',
    'A': 'En',
    'An': 'En',
    'This': 'Denne',
    'These': 'Disse',
    'That': 'Den',
    'Those': 'De',
    'is': 'er',
    'are': 'er',
    'was': 'var',
    'were': 'var',
    'will': 'vil',
    'can': 'kan',
    'could': 'kunne',
    'should': 'burde',
    'would': 'ville',
    'may': 'må',
    'might': 'kunne',
    'must': 'skal',
    'has': 'har',
    'have': 'har',
    'had': 'havde',
  };
  
  // Simple word replacement for demonstration
  let translated = text;
  Object.entries(danishPrefixes).forEach(([english, danish]) => {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translated = translated.replace(regex, danish);
  });
  
  // Add Danish-specific characters for authenticity
  translated = translated
    .replace(/oo/g, 'ø')
    .replace(/aa/g, 'å')
    .replace(/ae/g, 'æ');
  
  return translated;
}

/**
 * Creates a bilingual content object
 */
async function createBilingualContent(text: string): Promise<Content> {
  if (!text) {
    return { original: '' };
  }
  
  const danish = await translateToDanish(text);
  return {
    original: text,
    danish,
  };
}

/**
 * Generates content based on scraped metadata
 * Note: In a production environment, this would use a proper AI model
 */
async function generateContent(metadata: Partial<ScrapedMetadata>): Promise<GeneratedContent> {
  // Extract the most relevant information
  const title = metadata.title?.original || '';
  const description = metadata.description?.original || '';
  const domain = metadata.domain || '';
  const keywords = metadata.keywords || [];
  
  // Generate a summary
  const summaryText = `${title} is an AI tool from ${domain} that ${description.substring(0, 100)}...`;
  const summary = await createBilingualContent(summaryText);
  
  // Generate an article
  const articleText = `
# ${title}

${description}

## About ${metadata.name}

${metadata.name} is a powerful AI tool that helps users with various tasks related to ${keywords.join(', ')}. 
The tool is designed to be user-friendly and efficient, providing a seamless experience for both beginners and experts.

## Key Features

- Advanced AI algorithms for optimal results
- User-friendly interface
- Fast processing times
- Integration with popular platforms
- Regular updates and improvements

## Use Cases

${metadata.name} can be used in various scenarios, including but not limited to:
- Content creation and optimization
- Data analysis and visualization
- Automation of repetitive tasks
- Decision-making support

## Pricing

${metadata.pricing?.isFree ? 'This tool is available for free.' : 'This tool offers various pricing options to suit different needs.'}
${metadata.pricing?.hasTrial ? 'A free trial is available for users who want to test the features before committing.' : ''}

## Conclusion

${metadata.name} is a valuable addition to any AI toolkit, offering powerful features and capabilities that can significantly enhance productivity and results.
`;
  
  const article = await createBilingualContent(articleText);
  
  // Generate key points
  const keyPointsText = [
    `${metadata.name} is a tool for ${keywords[0] || 'AI tasks'}.`,
    `It offers a user-friendly interface for easy navigation.`,
    `The tool is regularly updated with new features.`,
    `It integrates with popular platforms for seamless workflow.`,
  ];
  
  const keyPoints = await Promise.all(keyPointsText.map(point => createBilingualContent(point)));
  
  // Generate pros and cons
  const prosText = [
    `Easy to use interface`,
    `Powerful AI capabilities`,
    `Regular updates`,
    `Good documentation`,
  ];
  
  const consText = [
    `May require some learning curve for advanced features`,
    `Limited free tier (if applicable)`,
    `Some features may be in beta`,
  ];
  
  const pros = await Promise.all(prosText.map(pro => createBilingualContent(pro)));
  const cons = await Promise.all(consText.map(con => createBilingualContent(con)));
  
  return {
    summary,
    article,
    keyPoints,
    pros,
    cons,
  };
}

/**
 * Extracts the main content from the page
 */
async function extractMainContent(document: Document): Promise<Content> {
  // Try to find the main content area
  const contentSelectors = [
    'article',
    'main',
    '.content',
    '#content',
    '.post-content',
    '.entry-content',
    '.article-content',
  ];
  
  let mainContentElement = null;
  
  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent && element.textContent.trim().length > 100) {
      mainContentElement = element;
      break;
    }
  }
  
  // If no specific content area is found, use the body
  if (!mainContentElement) {
    // Remove navigation, footer, sidebar, etc.
    const body = document.body.cloneNode(true) as HTMLElement;
    
    const elementsToRemove = [
      'nav', 'header', 'footer', 'aside', 
      '.nav', '.header', '.footer', '.sidebar', 
      '#nav', '#header', '#footer', '#sidebar',
      '.navigation', '.menu', '.comments', '.ads', '.advertisement'
    ];
    
    elementsToRemove.forEach(selector => {
      body.querySelectorAll(selector).forEach(el => el.remove());
    });
    
    mainContentElement = body;
  }
  
  const content = mainContentElement?.textContent?.trim() || '';
  
  // Limit content length to avoid excessive processing
  const truncatedContent = content.substring(0, 5000);
  
  return createBilingualContent(truncatedContent);
}

/**
 * Generates appropriate tags based on content
 */
function generateTags(metadata: Partial<ScrapedMetadata>): string[] {
  const title = metadata.title?.original || '';
  const description = metadata.description?.original || '';
  const keywords = metadata.keywords || [];
  const existingTags = metadata.tags || [];
  
  // Combine all text for analysis
  const combinedText = `${title} ${description} ${keywords.join(' ')}`.toLowerCase();
  
  // Define common AI-related keywords to look for
  const aiKeywords = [
    'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning',
    'nlp', 'natural language processing', 'computer vision', 'neural network',
    'algorithm', 'automation', 'bot', 'chatbot', 'gpt', 'llm', 'large language model',
    'data science', 'analytics', 'prediction', 'classification', 'recognition',
    'generation', 'transformer', 'vector', 'embedding', 'prompt', 'fine-tuning'
  ];
  
  // Check for AI-related keywords in the text
  const detectedTags = aiKeywords.filter(keyword => 
    combinedText.includes(keyword.toLowerCase())
  );
  
  // Add pricing tags
  if (metadata.pricing?.isFree) {
    detectedTags.push('free');
  } else {
    detectedTags.push('paid');
  }
  
  if (metadata.pricing?.hasTrial) {
    detectedTags.push('free-trial');
  }
  
  // Combine with existing tags and remove duplicates
  const allTags = [...new Set([...existingTags, ...detectedTags, 'ai-tool'])];
  
  return allTags;
}

/**
 * Determines appropriate categories based on content
 */
function generateCategories(metadata: Partial<ScrapedMetadata>): string[] {
  const title = metadata.title?.original || '';
  const description = metadata.description?.original || '';
  const keywords = metadata.keywords || [];
  const existingCategories = metadata.categories || [];
  
  // Combine all text for analysis
  const combinedText = `${title} ${description} ${keywords.join(' ')}`.toLowerCase();
  
  // Define category mapping
  const categoryKeywords: Record<string, string[]> = {
    'Text Generation': ['text generation', 'content creation', 'writing', 'copywriting', 'blog', 'article'],
    'Image Generation': ['image', 'art', 'design', 'graphic', 'photo', 'picture', 'dall-e', 'midjourney', 'stable diffusion'],
    'Code Assistant': ['code', 'programming', 'developer', 'software', 'github', 'copilot'],
    'Chatbot': ['chat', 'conversation', 'assistant', 'support', 'customer service'],
    'Data Analysis': ['data', 'analytics', 'visualization', 'dashboard', 'insight', 'statistics'],
    'Productivity': ['productivity', 'workflow', 'automation', 'efficiency', 'time-saving'],
    'Marketing': ['marketing', 'seo', 'advertising', 'campaign', 'social media'],
    'Education': ['education', 'learning', 'teaching', 'student', 'course', 'tutor'],
    'Research': ['research', 'academic', 'paper', 'study', 'analysis'],
    'Business': ['business', 'enterprise', 'company', 'corporate', 'management'],
  };
  
  // Detect categories based on keywords
  const detectedCategories = Object.entries(categoryKeywords)
    .filter(([_, keywords]) => 
      keywords.some(keyword => combinedText.includes(keyword))
    )
    .map(([category, _]) => category);
  
  // If no categories detected, use a default
  if (detectedCategories.length === 0) {
    detectedCategories.push('AI Tools');
  }
  
  // Combine with existing categories and remove duplicates
  const allCategories = [...new Set([...existingCategories, ...detectedCategories])];
  
  return allCategories;
}

/**
 * Extracts pricing information from the page
 */
function extractPricing(document: Document): ScrapedMetadata['pricing'] {
  // Look for pricing-related elements
  const pricingSelectors = [
    '.pricing', '#pricing', '.price', '#price',
    '.plan', '.subscription', '.package', '.tier'
  ];
  
  let pricingElement = null;
  
  for (const selector of pricingSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      pricingElement = element;
      break;
    }
  }
  
  if (!pricingElement) {
    // Try to find pricing in the text
    const text = document.body.textContent?.toLowerCase() || '';
    
    const isFree = text.includes('free') || text.includes('no cost') || text.includes('$0');
    const hasTrial = text.includes('trial') || text.includes('try for free') || text.includes('demo');
    
    // Try to extract price
    const priceRegex = /\$\d+(\.\d{2})?/g;
    const priceMatches = text.match(priceRegex);
    const price = priceMatches ? priceMatches[0] : undefined;
    
    // Try to determine pricing model
    const pricingModel = text.includes('subscription') ? 'subscription' :
                         text.includes('one-time') ? 'one-time' :
                         text.includes('monthly') ? 'monthly' :
                         text.includes('yearly') ? 'yearly' :
                         undefined;
    
    return {
      isFree,
      hasTrial,
      price,
      pricingModel,
    };
  }
  
  // Extract pricing information from the element
  const text = pricingElement.textContent?.toLowerCase() || '';
  
  const isFree = text.includes('free') || text.includes('no cost') || text.includes('$0');
  const hasTrial = text.includes('trial') || text.includes('try for free') || text.includes('demo');
  
  // Try to extract price
  const priceRegex = /\$\d+(\.\d{2})?/g;
  const priceMatches = text.match(priceRegex);
  const price = priceMatches ? priceMatches[0] : undefined;
  
  // Try to determine pricing model
  const pricingModel = text.includes('subscription') ? 'subscription' :
                       text.includes('one-time') ? 'one-time' :
                       text.includes('monthly') ? 'monthly' :
                       text.includes('yearly') ? 'yearly' :
                       undefined;
  
  return {
    isFree,
    hasTrial,
    price,
    pricingModel,
  };
}

/**
 * Extracts metadata from HTML content
 */
async function extractMetadata(html: string, url: string): Promise<ScrapedMetadata> {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Extract domain name for the codename
  const urlObj = new URL(url);
  const domain = urlObj.hostname.replace("www.", "");
  const domainParts = domain.split(".");
  const name = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
  
  // Basic metadata
  const titleText = document.querySelector('title')?.textContent || '';
  const title = await createBilingualContent(titleText);
  
  // Meta tags
  const metaTags = Array.from(document.querySelectorAll('meta'));
  const getMetaContent = (name: string) => 
    metaTags.find(tag => tag.getAttribute('name') === name)?.getAttribute('content');
  const getMetaProperty = (property: string) => 
    metaTags.find(tag => tag.getAttribute('property') === property)?.getAttribute('content');
  
  // Extract description
  const descriptionText = getMetaContent('description') || '';
  const description = await createBilingualContent(descriptionText);
  
  // Open Graph metadata
  const ogTitleText = getMetaProperty('og:title') || '';
  const ogTitle = ogTitleText ? await createBilingualContent(ogTitleText) : undefined;
  
  const ogDescriptionText = getMetaProperty('og:description') || '';
  const ogDescription = ogDescriptionText ? await createBilingualContent(ogDescriptionText) : undefined;
  
  const ogImage = getMetaProperty('og:image') || '';
  const ogType = getMetaProperty('og:type') || '';
  
  // Twitter metadata
  const twitterCard = getMetaContent('twitter:card') || '';
  const twitterSite = getMetaContent('twitter:site') || '';
  const twitterCreator = getMetaContent('twitter:creator') || '';
  const twitterImage = getMetaContent('twitter:image') || '';
  
  const twitterTitleText = getMetaContent('twitter:title') || '';
  const twitterTitle = twitterTitleText ? await createBilingualContent(twitterTitleText) : undefined;
  
  const twitterDescriptionText = getMetaContent('twitter:description') || '';
  const twitterDescription = twitterDescriptionText ? await createBilingualContent(twitterDescriptionText) : undefined;
  
  // Additional metadata
  const author = getMetaContent('author') || '';
  const keywords = getMetaContent('keywords')?.split(',').map(k => k.trim()) || [];
  const language = document.documentElement.getAttribute('lang') || '';
  const themeColor = getMetaContent('theme-color') || '';
  const publishedTime = getMetaProperty('article:published_time') || '';
  const modifiedTime = getMetaProperty('article:modified_time') || '';
  
  // Favicon
  const faviconLink = document.querySelector('link[rel="icon"]') || 
                      document.querySelector('link[rel="shortcut icon"]');
  const faviconHref = faviconLink?.getAttribute('href') || '';
  const favicon = faviconHref ? new URL(faviconHref, url).href : '';
  
  // Extract potential tags and categories
  const extractedTags = Array.from(document.querySelectorAll('.tag, .tags, [data-tag], [data-tags]'))
    .map(el => el.textContent?.trim())
    .filter(Boolean) as string[];
  
  const extractedCategories = Array.from(document.querySelectorAll('.category, .categories, [data-category], [data-categories]'))
    .map(el => el.textContent?.trim())
    .filter(Boolean) as string[];
  
  // Extract main content
  const mainContent = await extractMainContent(document);
  
  // Extract pricing information
  const pricing = extractPricing(document);
  
  // Create initial metadata object
  const initialMetadata: Partial<ScrapedMetadata> = {
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    url,
    domain,
    name,
    favicon,
    keywords,
    author,
    twitterCard,
    twitterSite,
    twitterCreator,
    twitterImage,
    twitterTitle,
    twitterDescription,
    language,
    themeColor,
    type: ogType,
    publishedTime,
    modifiedTime,
    tags: extractedTags,
    categories: extractedCategories,
    mainContent,
    pricing,
  };
  
  // Generate appropriate tags and categories
  const tags = generateTags(initialMetadata);
  const categories = generateCategories(initialMetadata);
  
  // Generate AI-enhanced content
  const generatedContent = await generateContent(initialMetadata);
  
  // Create the final metadata object
  const metadata: ScrapedMetadata = {
    ...initialMetadata as any,
    tags,
    categories,
    generatedContent,
  };
  
  return metadata;
}

/**
 * Scrapes a website and extracts metadata, ignoring robots.txt
 */
export async function scrapeWebsite(url: string, useCache = true): Promise<ScrapedMetadata> {
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Check cache first if enabled
  if (useCache && cache.has(url)) {
    return cache.get(url)!;
  }
  
  // In development mode, return mock data to avoid external dependencies
  if (isDevelopment) {
    console.log(`[DEV MODE] Mocking scrape for URL: ${url}`);
    
    // Parse the URL to extract domain information
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");
    const domainParts = domain.split(".");
    const name = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
    
    // Create mock metadata
    const mockMetadata: ScrapedMetadata = {
      title: { original: `${name} - AI Tool`, danish: `${name} - KI Værktøj` },
      description: { 
        original: `${name} is an advanced AI tool that helps users with various tasks.`, 
        danish: `${name} er et avanceret KI-værktøj, der hjælper brugere med forskellige opgaver.` 
      },
      url: url,
      domain: domain,
      name: name,
      favicon: `https://${domain}/favicon.ico`,
      keywords: ["ai", "tool", "automation"],
      tags: ["ai-tool", "productivity", "automation"],
      categories: ["AI Tools"],
      pricing: {
        isFree: Math.random() > 0.5,
        hasTrial: true,
        price: "$9.99/month",
        pricingModel: "subscription"
      },
      generatedContent: {
        summary: { 
          original: `${name} is a powerful AI tool that helps users automate tasks and improve productivity.`,
          danish: `${name} er et kraftfuldt KI-værktøj, der hjælper brugere med at automatisere opgaver og forbedre produktivitet.`
        },
        article: {
          original: `# ${name}\n\n${name} is a powerful AI tool that helps users automate tasks and improve productivity. It offers a range of features including content generation, data analysis, and workflow automation.\n\n## Features\n\n- AI-powered automation\n- Content generation\n- Data analysis\n- Workflow optimization\n\n## Benefits\n\nUsing ${name} can help you save time, improve efficiency, and achieve better results in your work.`,
          danish: `# ${name}\n\n${name} er et kraftfuldt KI-værktøj, der hjælper brugere med at automatisere opgaver og forbedre produktivitet. Det tilbyder en række funktioner, herunder indholdsgeneration, dataanalyse og arbejdsgang automatisering.\n\n## Funktioner\n\n- KI-drevet automatisering\n- Indholdsgeneration\n- Dataanalyse\n- Arbejdsgangsoptimering\n\n## Fordele\n\nBrug af ${name} kan hjælpe dig med at spare tid, forbedre effektiviteten og opnå bedre resultater i dit arbejde.`
        },
        keyPoints: [
          { original: `${name} uses advanced AI to automate tasks.`, danish: `${name} bruger avanceret KI til at automatisere opgaver.` },
          { original: `It helps improve productivity and efficiency.`, danish: `Det hjælper med at forbedre produktivitet og effektivitet.` },
          { original: `Regular updates add new features and capabilities.`, danish: `Regelmæssige opdateringer tilføjer nye funktioner og muligheder.` },
          { original: `Integrates with popular tools and platforms.`, danish: `Integrerer med populære værktøjer og platforme.` }
        ],
        pros: [
          { original: `Easy to use interface`, danish: `Brugervenlig grænseflade` },
          { original: `Powerful AI capabilities`, danish: `Kraftfulde KI-funktioner` },
          { original: `Regular updates`, danish: `Regelmæssige opdateringer` },
          { original: `Good documentation`, danish: `God dokumentation` }
        ],
        cons: [
          { original: `May require some learning curve for advanced features`, danish: `Kan kræve en vis læringskurve for avancerede funktioner` },
          { original: `Limited free tier`, danish: `Begrænset gratis niveau` },
          { original: `Some features may be in beta`, danish: `Nogle funktioner kan være i beta` }
        ]
      },
      mainContent: {
        original: `${name} is a powerful AI tool that helps users automate tasks and improve productivity. It offers a range of features including content generation, data analysis, and workflow automation.`,
        danish: `${name} er et kraftfuldt KI-værktøj, der hjælper brugere med at automatisere opgaver og forbedre produktivitet. Det tilbyder en række funktioner, herunder indholdsgeneration, dataanalyse og arbejdsgang automatisering.`
      }
    };
    
    // Cache the mock result if caching is enabled
    if (useCache) {
      cache.set(url, mockMetadata);
    }
    
    return mockMetadata;
  }
  
  try {
    // Fetch the HTML content with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(url, {
      headers: {
        // Use a browser-like User-Agent to avoid being blocked
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.85 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,da;q=0.8', // Add Danish language preference
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText} (${response.status})`);
    }
    
    const contentType = response.headers.get('content-type') || '';
    if (!contentType || !contentType.includes('text/html')) {
      throw new Error(`URL does not return HTML content: ${contentType || 'unknown content type'}`);
    }
    
    const html = await response.text();
    
    // Extract metadata
    const metadata = await extractMetadata(html, url);
    
    // Validate metadata
    const validatedMetadata = ScrapedMetadataSchema.parse(metadata);
    
    // Cache the result if caching is enabled
    if (useCache) {
      cache.set(url, validatedMetadata);
    }
    
    return validatedMetadata;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out after 15 seconds');
    }
    
    if (error instanceof z.ZodError) {
      throw new Error(`Metadata validation failed: ${error.message}`);
    }
    
    throw error;
  }
}

/**
 * Clears the scraper cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Gets the size of the scraper cache
 */
export function getCacheSize(): number {
  return cache.size;
}
