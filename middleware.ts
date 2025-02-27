import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/db/supabase/middleware";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextFetchEvent } from "next/server";

// This function combines Supabase and Clerk middleware
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  // First, update the Supabase session
  const supabaseResponse = await updateSession(request);
  
  // Then, apply Clerk middleware
  const clerkResponse = clerkMiddleware()(request, event);
  
  // Return the response with both middleware applied
  return clerkResponse || supabaseResponse;
}

// Configure the matcher for the middleware
export const config = {
  matcher: [
    // Match all routes except static files and api routes that don't need auth
    "/((?!_next/static|_next/image|favicon.ico|api/scrape).*)",
  ],
};
