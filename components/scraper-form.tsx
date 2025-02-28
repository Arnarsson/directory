"use client"

import { LanguageSelector } from "@/components/language-selector"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle, CheckCircle, Globe, Tag, Info, DollarSign, List } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { scrapeUrlAction } from "@/app/scraper/actions"
import { ScrapedMetadata } from "@/lib/scraper"

// Submit button with loading state
function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  const { t } = useLanguage()
  
  return (
    <Button 
      type="submit" 
      className="w-full bg-primary-teal hover:bg-primary-light text-white dark:bg-secondary-coral dark:hover:bg-secondary-light dark:text-black"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
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

// Metadata display component
function MetadataDisplay({ metadata, language }: { metadata: ScrapedMetadata, language: 'original' | 'danish' }) {
  const { t } = useLanguage()
  
  // Helper function to get content in the selected language
  const getContent = (content: { original: string, danish?: string } | undefined) => {
    if (!content) return '';
    return language === 'danish' && content.danish ? content.danish : content.original;
  }
  
  return (
    <div className="mt-6 space-y-4 text-sm">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary-teal/10 dark:border-secondary-coral/10">
        <h3 className="text-lg font-semibold mb-2 flex items-center text-primary-teal dark:text-secondary-coral">
          <Info className="h-4 w-4 mr-2" /> {t("basicInfo")}
        </h3>
        <div className="space-y-2">
          <p><span className="font-medium">{t("title")}:</span> {getContent(metadata.title)}</p>
          <p><span className="font-medium">{t("description")}:</span> {getContent(metadata.description)}</p>
          <p><span className="font-medium">{t("website")}:</span> <a href={metadata.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{metadata.url}</a></p>
        </div>
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary-teal/10 dark:border-secondary-coral/10">
        <h3 className="text-lg font-semibold mb-2 flex items-center text-primary-teal dark:text-secondary-coral">
          <Tag className="h-4 w-4 mr-2" /> {t("classification")}
        </h3>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {metadata.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-primary-teal/10 dark:bg-secondary-coral/10 text-primary-teal dark:text-secondary-coral rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
          <p><span className="font-medium">{t("categories")}:</span> {metadata.categories.join(', ')}</p>
        </div>
      </div>
      
      {metadata.pricing && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary-teal/10 dark:border-secondary-coral/10">
          <h3 className="text-lg font-semibold mb-2 flex items-center text-primary-teal dark:text-secondary-coral">
            <DollarSign className="h-4 w-4 mr-2" /> {t("pricing")}
          </h3>
          <div className="space-y-2">
            <p><span className="font-medium">{t("pricingType")}:</span> {metadata.pricing.isFree ? t("free") : t("paid")}</p>
            {metadata.pricing.hasTrial && <p>{t("freeTrial")}</p>}
            {metadata.pricing.price && <p><span className="font-medium">{t("price")}:</span> {metadata.pricing.price}</p>}
            {metadata.pricing.pricingModel && <p><span className="font-medium">{t("pricingModel")}:</span> {metadata.pricing.pricingModel}</p>}
          </div>
        </div>
      )}
      
      {metadata.generatedContent && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary-teal/10 dark:border-secondary-coral/10">
          <h3 className="text-lg font-semibold mb-2 flex items-center text-primary-teal dark:text-secondary-coral">
            <List className="h-4 w-4 mr-2" /> {t("generatedContent")}
          </h3>
          <div className="space-y-2">
            <p><span className="font-medium">{t("summary")}:</span> {getContent(metadata.generatedContent.summary)}</p>
            
            <div className="mt-4">
              <h4 className="font-medium mb-1">{t("keyPoints")}</h4>
              <ul className="list-disc pl-5 space-y-1">
                {metadata.generatedContent.keyPoints.map((point, index) => (
                  <li key={index}>{getContent(point)}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1 text-green-600 dark:text-green-400">{t("pros")}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {metadata.generatedContent.pros.map((pro, index) => (
                    <li key={index}>{getContent(pro)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1 text-red-600 dark:text-red-400">{t("cons")}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {metadata.generatedContent.cons.map((con, index) => (
                    <li key={index}>{getContent(con)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ScraperForm() {
  const { t, currentLanguage } = useLanguage()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [displayLanguage, setDisplayLanguage] = useState<'original' | 'danish'>('original')
  const [state, setState] = useState<{
    message: string;
    success?: boolean;
    issues?: string[];
    metadata?: ScrapedMetadata;
  }>({ message: "", success: false, issues: [] })
  
  // Custom form action wrapper to track submission state
  const handleFormAction = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      console.log("Submitting form with URL:", formData.get("url"))
      const result = await scrapeUrlAction(state, formData)
      console.log("Scrape result:", result)
      setState(result)
    } catch (error) {
      console.error("Error in handleFormAction:", error)
      setState({
        message: "An error occurred",
        success: false,
        issues: [error instanceof Error ? error.message : "Unknown error"]
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-primary-teal/10 dark:border-secondary-coral/10">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-teal dark:text-secondary-coral">{t("aiResourceScraper")}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
        {t("enterUrl")}
      </p>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleFormAction(formData);
      }} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Input
              type="url"
              name="url"
              placeholder="https://example.com"
              className="w-full focus:ring-primary-teal dark:focus:ring-secondary-coral"
              required
            />
          </div>
        </div>
        
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
      
      {state.issues && state.issues.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-md text-sm animate-in fade-in duration-300">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500 dark:text-red-400" />
            <div>
              <p className="font-medium">{state.message}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {state.issues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {state.success && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded-md text-sm animate-in fade-in duration-300">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-green-500 dark:text-green-400" />
            <div dangerouslySetInnerHTML={{ __html: state.message }} />
          </div>
        </div>
      )}
      
      {state.metadata && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-primary-teal dark:text-secondary-coral">{t("scrapedMetadata")}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t("displayLanguage")}:</span>
              <Select value={displayLanguage} onValueChange={(value) => setDisplayLanguage(value as 'original' | 'danish')}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={t("selectLanguage")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      {t("original")}
                    </div>
                  </SelectItem>
                  <SelectItem value="danish">
                    <div className="flex items-center">
                      <span className="mr-2">🇩🇰</span>
                      {t("danish")}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="metadata" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="metadata">{t("metadata")}</TabsTrigger>
              <TabsTrigger value="article">{t("generatedArticle")}</TabsTrigger>
            </TabsList>
            <TabsContent value="metadata">
              <MetadataDisplay metadata={state.metadata} language={displayLanguage} />
            </TabsContent>
            <TabsContent value="article">
              {state.metadata.generatedContent && (
                <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary-teal/10 dark:border-secondary-coral/10 prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ 
                    __html: displayLanguage === 'danish' && state.metadata.generatedContent.article.danish 
                      ? state.metadata.generatedContent.article.danish.replace(/\n/g, '<br />') 
                      : state.metadata.generatedContent.article.original.replace(/\n/g, '<br />') 
                  }} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 bg-primary-teal/5 dark:bg-secondary-coral/5 p-4 rounded-md border border-primary-teal/10 dark:border-secondary-coral/10">
        <p className="font-medium text-primary-teal dark:text-secondary-coral mb-2">{t("scraperDescription")}</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Extract metadata from the URL</li>
          <li>Analyze the content to categorize the AI tool</li>
          <li>Generate appropriate tags and descriptions</li>
          <li>Create bilingual content (original and Danish)</li>
          <li>Auto-generate summaries and articles</li>
          <li>Submit for review before adding to the directory</li>
        </ul>
      </div>
    </div>
  )
}
