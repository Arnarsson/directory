// Translation keys for English and Danish
export type TranslationKey = keyof typeof en;

// English translations (base language)
export const en = {
  // Navigation
  "home": "Home",
  "submit": "Submit",
  "aiScraper": "AI Scraper",
  "login": "Login",
  "logout": "Logout",
  
  // Hero section
  "ethos": "Ethos AI",
  "premiumAiDirectory": "Premium AI Directory",
  "aiToolsResourcesDirectory": "AI Tools & Resources Directory",
  "discoverBestAiTools": "Discover the best AI tools and resources to enhance your workflow and productivity.",
  "explore": "Explore",
  "learn": "Learn",
  "innovate": "Innovate",
  "submitTool": "Submit tool",
  "updates": "updates",
  
  // Categories
  "aiTools": "AI Tools",
  "machineLearning": "Machine Learning",
  "naturalLanguageProcessing": "Natural Language Processing",
  "computerVision": "Computer Vision",
  "robotics": "Robotics",
  "dataScience": "Data Science",
  
  // Labels
  "free": "Free",
  "paid": "Paid",
  "openSource": "Open Source",
  "enterprise": "Enterprise",
  "api": "API",
  "sdk": "SDK",
  
  // Scraper page
  "aiResourceScraper": "AI Resource Scraper",
  "automaticallyDiscover": "Automatically discover and add AI tools to our directory",
  "scraperDescription": "Our AI-powered scraper uses advanced machine learning algorithms to extract and categorize information about AI tools and resources from any URL.",
  "authRequired": "Authentication Required",
  "signInRequired": "You need to be signed in to use the AI Resource Scraper.",
  "signIn": "Sign In",
  
  // Form
  "enterUrl": "Enter a URL to an AI tool or resource to automatically add it to our directory",
  "scrapeUrl": "Scrape URL",
  "scraping": "Scraping...",
  
  // Auth
  "signInToEthos": "Sign in to Ethos AI",
  "welcomeBack": "Welcome back! Please sign in to continue",
  "continueWithGoogle": "Continue with Google",
  "emailAddress": "Email address",
  "enterYourEmail": "Enter your email address",
  "continue": "Continue",
  "dontHaveAccount": "Don't have an account?",
  "signUp": "Sign up",
  
  // Language selector
  "language": "Language",
  "english": "English",
  "danish": "Danish",
  
  // Enhanced scraper UI
  "selectLanguage": "Select language",
  "displayLanguage": "Display language",
  "original": "Original",
  "scrapedMetadata": "Scraped Metadata",
  "metadata": "Metadata",
  "generatedArticle": "Generated Article",
  "basicInfo": "Basic Information",
  "title": "Title",
  "description": "Description",
  "website": "Website",
  "classification": "Classification",
  "categories": "Categories",
  "pricing": "Pricing",
  "pricingType": "Pricing Type",
  "freeTrial": "Free trial available",
  "price": "Price",
  "pricingModel": "Pricing Model",
  "generatedContent": "Generated Content",
  "summary": "Summary",
  "keyPoints": "Key Points",
  "pros": "Pros",
  "cons": "Cons"
};

// Danish translations
export const da = {
  // Navigation
  "home": "Hjem",
  "submit": "Indsend",
  "aiScraper": "AI Scraper",
  "login": "Log ind",
  "logout": "Log ud",
  
  // Hero section
  "ethos": "Ethos AI",
  "premiumAiDirectory": "Premium AI Katalog",
  "aiToolsResourcesDirectory": "AI Værktøjer & Ressourcer Katalog",
  "discoverBestAiTools": "Opdag de bedste AI-værktøjer og ressourcer til at forbedre dit workflow og produktivitet.",
  "explore": "Udforsk",
  "learn": "Lær",
  "innovate": "Innover",
  "submitTool": "Indsend værktøj",
  "updates": "opdateringer",
  
  // Categories
  "aiTools": "AI Værktøjer",
  "machineLearning": "Maskinlæring",
  "naturalLanguageProcessing": "Naturlig Sprogbehandling",
  "computerVision": "Computer Vision",
  "robotics": "Robotteknologi",
  "dataScience": "Datavidenskab",
  
  // Labels
  "free": "Gratis",
  "paid": "Betalt",
  "openSource": "Open Source",
  "enterprise": "Virksomhed",
  "api": "API",
  "sdk": "SDK",
  
  // Scraper page
  "aiResourceScraper": "AI Ressource Scraper",
  "automaticallyDiscover": "Automatisk opdagelse og tilføjelse af AI-værktøjer til vores katalog",
  "scraperDescription": "Vores AI-drevne scraper bruger avancerede maskinlæringsalgoritmer til at udtrække og kategorisere information om AI-værktøjer og ressourcer fra enhver URL.",
  "authRequired": "Godkendelse Påkrævet",
  "signInRequired": "Du skal være logget ind for at bruge AI Resource Scraper.",
  "signIn": "Log ind",
  
  // Form
  "enterUrl": "Indtast en URL til et AI-værktøj eller ressource for automatisk at tilføje det til vores katalog",
  "scrapeUrl": "Scrap URL",
  "scraping": "Scraper...",
  
  // Auth
  "signInToEthos": "Log ind på Ethos AI",
  "welcomeBack": "Velkommen tilbage! Log ind for at fortsætte",
  "continueWithGoogle": "Fortsæt med Google",
  "emailAddress": "E-mailadresse",
  "enterYourEmail": "Indtast din e-mailadresse",
  "continue": "Fortsæt",
  "dontHaveAccount": "Har du ikke en konto?",
  "signUp": "Tilmeld dig",
  
  // Language selector
  "language": "Sprog",
  "english": "Engelsk",
  "danish": "Dansk",
  
  // Enhanced scraper UI
  "selectLanguage": "Vælg sprog",
  "displayLanguage": "Visningssprog",
  "original": "Original",
  "scrapedMetadata": "Scrapede Metadata",
  "metadata": "Metadata",
  "generatedArticle": "Genereret Artikel",
  "basicInfo": "Grundlæggende Information",
  "title": "Titel",
  "description": "Beskrivelse",
  "website": "Hjemmeside",
  "classification": "Klassifikation",
  "categories": "Kategorier",
  "pricing": "Priser",
  "pricingType": "Pristype",
  "freeTrial": "Gratis prøveperiode tilgængelig",
  "price": "Pris",
  "pricingModel": "Prismodel",
  "generatedContent": "Genereret Indhold",
  "summary": "Sammendrag",
  "keyPoints": "Nøglepunkter",
  "pros": "Fordele",
  "cons": "Ulemper"
};

// Type for available languages
export type Language = 'en' | 'da';

// Get translation function
export const getTranslation = (lang: Language, key: TranslationKey): string => {
  if (lang === 'en') return en[key];
  if (lang === 'da') return da[key];
  return en[key]; // Fallback to English
};
