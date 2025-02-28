"use server"

import "server-only"
import { cache } from "react"
import { revalidatePath } from "next/cache"

// Mock data for AI tools
let mockProducts = [
  {
    id: "1",
    created_at: "2025-01-15T12:00:00Z",
    full_name: "John Doe",
    email: "john@example.com",
    twitter_handle: "@johndoe",
    product_website: "https://chatgpt.com",
    codename: "ChatGPT",
    punchline: "Advanced AI language model for conversation and content creation",
    description: "ChatGPT is an AI-powered chatbot developed by OpenAI, based on the GPT (Generative Pre-trained Transformer) language model. It can engage in conversational dialogue and provide responses that can appear remarkably human.",
    logo_src: "/ad-placeholder-1.png",
    user_id: "user1",
    tags: ["ChatGPT", "GPT-4", "OpenAI"],
    view_count: 1250,
    approved: true,
    labels: ["Paid", "API"],
    categories: "Natural Language Processing"
  },
  {
    id: "2",
    created_at: "2025-01-20T14:30:00Z",
    full_name: "Jane Smith",
    email: "jane@example.com",
    twitter_handle: "@janesmith",
    product_website: "https://claude.ai",
    codename: "Claude",
    punchline: "Helpful, harmless, and honest AI assistant",
    description: "Claude is an AI assistant created by Anthropic to be helpful, harmless, and honest. It's designed to be a conversational AI system that's steerable, interpretable, and harmless.",
    logo_src: "/ad-placeholder-metrics.png",
    user_id: "user2",
    tags: ["Claude", "Anthropic"],
    view_count: 980,
    approved: true,
    labels: ["Free", "Enterprise"],
    categories: "AI Tools"
  },
  {
    id: "3",
    created_at: "2025-02-05T09:15:00Z",
    full_name: "Alex Johnson",
    email: "alex@example.com",
    twitter_handle: "@alexj",
    product_website: "https://midjourney.com",
    codename: "Midjourney",
    punchline: "AI image generation from text descriptions",
    description: "Midjourney is an AI program that creates images from textual descriptions, similar to OpenAI's DALL-E and Stable Diffusion. The tool is currently in open beta and is available through a Discord bot.",
    logo_src: "/ad-placeholder-tags.png",
    user_id: "user3",
    tags: ["Midjourney", "Image Generation"],
    view_count: 1500,
    approved: true,
    labels: ["Paid"],
    categories: "Computer Vision"
  },
  {
    id: "4",
    created_at: "2025-02-10T16:45:00Z",
    full_name: "Sam Wilson",
    email: "sam@example.com",
    twitter_handle: "@samw",
    product_website: "https://huggingface.co",
    codename: "Hugging Face",
    punchline: "The AI community building the future",
    description: "Hugging Face is an AI community and platform that provides tools for building applications using machine learning. It's known for its Transformers library, which provides thousands of pretrained models.",
    logo_src: "/placeholder.png",
    user_id: "user4",
    tags: ["Hugging Face", "Transformers", "PyTorch"],
    view_count: 850,
    approved: true,
    labels: ["Open Source", "SDK"],
    categories: "Machine Learning"
  }
];

export const getProducts = cache(
  async (
    searchTerm?: string,
    category?: string,
    label?: string,
    tag?: string
  ) => {
    // Filter products based on search parameters
    let filteredProducts = [...mockProducts];
    
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.codename.toLowerCase().includes(searchTermLower) ||
        product.description.toLowerCase().includes(searchTermLower) ||
        product.punchline.toLowerCase().includes(searchTermLower)
      );
    }
    
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.categories === category
      );
    }
    
    if (label) {
      filteredProducts = filteredProducts.filter(product => 
        product.labels.includes(label)
      );
    }
    
    if (tag) {
      filteredProducts = filteredProducts.filter(product => 
        product.tags.includes(tag)
      );
    }
    
    return filteredProducts;
  }
);

export async function getProductById(id?: string) {
  if (!id) return [];
  
  const product = mockProducts.find(p => p.id === id);
  return product ? [product] : [];
}

export async function incrementClickCount(id: string) {
  // Mock implementation - in a real app, this would update the database
  console.log(`Incrementing click count for product ${id}`);
  
  const productIndex = mockProducts.findIndex(p => p.id === id);
  if (productIndex !== -1) {
    mockProducts[productIndex].view_count += 1;
    console.log(`New view count: ${mockProducts[productIndex].view_count}`);
  }
  
  revalidatePath("/products");
}

// Function to add a new product from scraped data
export async function addScrapedProduct(productData: any) {
  // Generate a new ID (in a real app, this would be handled by the database)
  const newId = (mockProducts.length + 1).toString();
  
  // Create a new product object
  const newProduct = {
    id: newId,
    created_at: new Date().toISOString(),
    full_name: productData.full_name || "Scraped from website",
    email: productData.email || "scraped@example.com",
    twitter_handle: productData.twitter_handle || "@scraped",
    product_website: productData.product_website || "",
    codename: productData.codename || "Unknown",
    punchline: productData.punchline || "",
    description: productData.description || "",
    logo_src: productData.logo_src || "/placeholder.png",
    user_id: productData.user_id || "dev-user-id",
    tags: Array.isArray(productData.tags) ? productData.tags : productData.tags?.split(', ') || ["ai-tool"],
    view_count: 0,
    approved: true,
    labels: Array.isArray(productData.labels) ? productData.labels : productData.labels?.split(', ') || ["unlabeled"],
    categories: productData.categories || "AI Tools"
  };
  
  // Add the new product to the mock products array
  mockProducts.push(newProduct);
  
  // Revalidate the products page to show the new product
  revalidatePath("/products");
  
  return newId;
}
