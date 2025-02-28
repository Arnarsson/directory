"use server"

import "server-only"
import { revalidatePath, revalidateTag } from "next/cache"
import { createClient } from "@/db/supabase/server"

// Only import AI-related modules in production
const isDevelopment = process.env.NODE_ENV === 'development'
let anthropicModel: any
let generateObjectFn: any
let getAIEnrichmentPromptFn: any
let enrichmentSchemaObj: any

if (!isDevelopment) {
  // Only import in production mode
  const { anthropic } = require("@ai-sdk/anthropic")
  const { generateObject } = require("ai")
  const { getAIEnrichmentPrompt } = require("./prompt")
  const { enrichmentSchema } = require("./schema")
  
  anthropicModel = anthropic("claude-3-haiku-20240307")
  generateObjectFn = generateObject
  getAIEnrichmentPromptFn = getAIEnrichmentPrompt
  enrichmentSchemaObj = enrichmentSchema
}

import { schema } from "./schema"

// Configuration object
const config = {
  // Disable AI enrichment in development mode to simplify testing
  aiEnrichmentEnabled: !isDevelopment,
  storageBucket: "product-logos",
  cacheControl: "3600",
  allowNewTags: true,
  allowNewLabels: true,
  allowNewCategories: true,
}

export type FormState = {
  message: string
  fields?: Record<string, string>
  issues: string[]
}

type Enrichment = {
  tags: string[]
  labels: string[]
}

// Helper function to check if an error has a message
function isErrorWithMessage(error: unknown): error is Error {
  return typeof error === "object" && error !== null && "message" in error
}

// Uploads the logo file to the storage bucket
async function uploadLogoFile(
  db: any,
  logoFile: File,
  codename: string
): Promise<string> {
  // In development mode, just mock the file upload
  if (isDevelopment) {
    console.log(`[DEV MODE] Mocking file upload for ${logoFile.name}`)
    return `https://example.com/mock-logo-${Date.now()}.png`
  }
  
  // In production mode, actually perform the file upload
  const fileExt = logoFile.name.split(".").pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${codename}/${fileName}`
  const fileBuffer = await logoFile.arrayBuffer()

  const { error: uploadError } = await db.storage
    .from(config.storageBucket)
    .upload(filePath, Buffer.from(fileBuffer), {
      cacheControl: config.cacheControl,
      upsert: false,
    })

  if (uploadError) {
    console.error(`Error uploading file: ${uploadError.message}`)
    throw new Error(uploadError.message)
  }

  const publicUrlResponse = db.storage
    .from(config.storageBucket)
    .getPublicUrl(filePath)
  console.log(
    `Logo file uploaded. Public URL: ${publicUrlResponse.data.publicUrl}`
  )
  return publicUrlResponse.data.publicUrl
}

// Inserts a new entry if it does not already exist
async function insertIfNotExists(
  db: any,
  table: string,
  name: string
): Promise<void> {
  console.log(`Attempting to insert ${name} into ${table}`)

  // In development mode, just mock the database operation
  if (isDevelopment) {
    console.log(`[DEV MODE] Mocking insertion of ${name} into ${table}`)
    return Promise.resolve()
  }

  // In production mode, actually perform the database operation
  const { error } = await db
    .from(table)
    .insert([{ name }], { onConflict: "name" })

  if (error) {
    // Check if error.message exists before using includes
    const isDuplicateKeyError = error.message && error.message.includes("duplicate key value");
    if (!isDuplicateKeyError) {
      const errorMessage = error.message || "Unknown error";
      console.error(`Error inserting into ${table}: ${errorMessage}`);
      throw new Error(`Error inserting into ${table}: ${errorMessage}`);
    }
  }

  console.log(`${name} successfully inserted or already exists in ${table}`)
}

export async function submitProductFormAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = Object.fromEntries(formData.entries())

  const logoFile = formData.get("images") as File

  const productState = await createProduct(data, logoFile)

  if (productState.message === "Tool submitted successfully") {
    revalidatePath("/", "page")
    revalidateTag("product-filters")
  }

  return productState
}

export async function createProduct(
  data: { [key: string]: FormDataEntryValue },
  logoFile?: File
): Promise<FormState> {
  const db = createClient()
  const parsed = schema.safeParse(data)

  if (!parsed.success) {
    console.error("Form validation failed")
    const fields: Record<string, string> = {}
    for (const key of Object.keys(data)) {
      fields[key] = data[key].toString()
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    }
  }

  try {
    // In development mode, bypass authentication check
    let user = { id: 'dev-user-id' };
    
    // Only check authentication in production
    if (!isDevelopment) {
      const { data: authData, error: authError } = await db.auth.getUser()
      if (authError || !authData.user) {
        console.error("User authentication failed")
        throw new Error("User authentication failed")
      }
      user = authData.user
    } else {
      console.log("Development mode: Authentication bypassed")
    }

    let logoUrl = ""
    if (logoFile) {
      logoUrl = await uploadLogoFile(db, logoFile, parsed.data.codename)
    }

    // Default values for tags and labels
    let tags: Enrichment["tags"] = ["ai-tool", "scraped"]
    let labels: Enrichment["labels"] = ["unlabeled"]

    // Only use AI enrichment in production mode
    if (config.aiEnrichmentEnabled && !isDevelopment) {
      console.log("Generating AI enrichment data")
      const enrichmentPrompt = getAIEnrichmentPromptFn(
        parsed.data.codename,
        parsed.data.categories,
        parsed.data.description
      )
      const { object: enrichment } = await generateObjectFn({
        model: anthropicModel,
        schema: enrichmentSchemaObj,
        prompt: enrichmentPrompt,
      })

      tags = enrichment.tags
      labels = enrichment.labels ?? ["unlabeled"]
    } else {
      console.log("Development mode: AI enrichment bypassed")
    }
    
    // Insert tags and labels
    if (config.allowNewTags) {
      try {
        for (const tag of tags) {
          try {
            await insertIfNotExists(db, "tags", tag)
          } catch (error) {
            console.error(`Error inserting tag "${tag}":`, error)
            // Continue with other tags even if one fails
          }
        }
      } catch (error) {
        console.error("Error inserting tags:", error)
        // Continue with product creation even if tags insertion fails
      }
    }

    if (config.allowNewLabels) {
      try {
        for (const label of labels) {
          try {
            await insertIfNotExists(db, "labels", label)
          } catch (error) {
            console.error(`Error inserting label "${label}":`, error)
            // Continue with other labels even if one fails
          }
        }
      } catch (error) {
        console.error("Error inserting labels:", error)
        // Continue with product creation even if labels insertion fails
      }
    }

    if (config.allowNewCategories) {
      try {
        await insertIfNotExists(db, "categories", parsed.data.categories)
      } catch (error) {
        console.error(`Error inserting category "${parsed.data.categories}":`, error)
        // Continue with product creation even if category insertion fails
      }
    }

    const productData = {
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      twitter_handle: parsed.data.twitterHandle,
      product_website: parsed.data.productWebsite,
      codename: parsed.data.codename,
      punchline: parsed.data.punchline,
      description: parsed.data.description,
      logo_src: logoUrl,
      categories: parsed.data.categories,
      user_id: user.id,
      tags,
      labels,
    }

    // In development mode, just mock the database operation
    if (isDevelopment) {
      console.log("[DEV MODE] Mocking product insertion:", productData)
      // Simulate successful insertion
    } else {
      // In production mode, actually perform the database operation
      try {
        console.log("Inserting product data:", productData)
        const { error } = await db.from("products").insert([productData]).select()

        if (error) {
          console.error(`Error inserting product data: ${error.message || "Unknown error"}`)
          throw new Error(error.message || "Unknown error inserting product data")
        }
      } catch (error) {
        console.error("Error during product insertion:", error)
        // Create a simplified version without tags and labels if that's causing issues
        try {
          console.log("Trying simplified product insertion without tags and labels")
          const simplifiedProductData = {
            ...productData,
            tags: ["ai-tool"], // Minimal tags
            labels: ["unlabeled"], // Minimal labels
          }
          
          const { error } = await db.from("products").insert([simplifiedProductData]).select()
          
          if (error) {
            console.error(`Error inserting simplified product data: ${error.message || "Unknown error"}`)
            throw new Error(error.message || "Unknown error inserting simplified product data")
          }
        } catch (fallbackError) {
          console.error("Fallback insertion also failed:", fallbackError)
          throw fallbackError
        }
      }
    }

    console.log("Product data successfully inserted")

    return { message: "Tool submitted successfully", issues: [] }
  } catch (error) {
    console.error(
      `Submission failed: ${
        isErrorWithMessage(error) ? error.message : "Unknown error occurred"
      }`
    )
    return {
      message: `Submission failed: ${
        isErrorWithMessage(error) ? error.message : "Unknown error occurred"
      }`,
      issues: [
        isErrorWithMessage(error) ? error.message : "Unknown error occurred",
      ],
    }
  }
}
