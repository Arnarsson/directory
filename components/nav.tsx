"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs"
import {
  BarChartIcon,
  BoxIcon,
  FilterIcon,
  FolderOpenIcon,
  Hash,
  HomeIcon,
  LogIn,
  LogOutIcon,
  PanelLeftIcon,
  PlusIcon,
  TagIcon,
  UsersIcon,
  Menu,
  X,
} from "lucide-react"

import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/i18n/language-context"
import { LogoAnimationLink } from "./logo-animation-link"
import { AdminNav } from "./admin-nav"

import { cn, truncateString } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ModeToggle } from "@/app/providers"

export function NavSidebar({
  categories,
  tags,
  labels,
}: {
  categories?: string[]
  labels?: string[]
  tags?: string[]
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  const { isSignedIn } = useAuth()
  const { t } = useLanguage()

  const handleLinkClick = () => {
    setSheetOpen(false)
  }

  // Add scroll event listener for sticky header effect with improved performance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        if (!scrolled) setScrolled(true)
      } else {
        if (scrolled) setScrolled(false)
      }
    }

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  return (
    <>
      <aside
        className={cn(
          pathname.includes("admin")
            ? "w-16 border-r border-primary-teal/10 dark:border-secondary-green/10"
            : "w-48",
          "fixed inset-y-0 left-0 z-10 flex flex-col bg-[#FAFAFA] dark:bg-background",
          "transition-all duration-300 ease-in-out",
          "shadow-[0_0_15px_rgba(42,157,143,0.05)] dark:shadow-[0_0_15px_rgba(231,111,81,0.05)]"
        )}
      >
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          {pathname.includes("admin") ? (
            <>
              <LogoAnimationLink />
              <AdminNav />
            </>
          ) : (
            <ProductNav
              categories={categories}
              tags={tags}
              labels={labels}
              searchParams={searchParams}
            />
          )}
        </nav>

        <div
          className={
            pathname.includes("admin")
              ? "flex flex-col gap-4 items-center py-5 mt-auto px-2 mx-2"
              : "pl-3 flex flex-col justify-center gap-4 items-start pb-8"
          }
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-primary-teal/50 dark:focus:ring-secondary-coral/50 rounded-full transition-transform duration-200 hover:scale-105">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-r from-primary-teal to-primary-light shadow-lg" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gradient-to-t from-primary-teal/70 to-primary-light/80 rounded-lg backdrop-blur-sm border border-white/20 shadow-xl animate-in slide-in-from-bottom-5 duration-300"
            >
              <div className="p-[1px] bg-background rounded-md">
                <DropdownMenuLabel className="text-primary-teal dark:text-secondary-coral font-bold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary-teal" />
                <DropdownMenuItem className="focus:bg-primary-teal/10 dark:focus:bg-secondary-coral/10 cursor-pointer transition-colors duration-200">
                  <Link href="/admin" className="flex w-full items-center">
                    <UsersIcon className="mr-2 h-4 w-4 text-primary-teal dark:text-secondary-coral" />
                    Admin
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-primary-teal" />
                <DropdownMenuItem>
                  <SignOutButton>
                    <Button className="w-full bg-gradient-to-r from-primary-teal to-primary-light hover:from-primary-light hover:to-primary-teal transition-all duration-300">
                      <LogOutIcon className="mr-1 size-4" /> Logout
                    </Button>
                  </SignOutButton>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <div className="flex flex-col gap-4 pb-2 px-2">
        <header
          className={cn(
            "flex justify-between items-center",
            "sticky-header",
            scrolled 
              ? "shadow-lg backdrop-blur-md bg-white/90 dark:bg-background/90 translate-y-0" 
              : "translate-y-0",
            "sticky top-0 z-30 flex h-14 mx-1 md:mx-0 rounded-b-lg items-center gap-4 px-4 sm:h-auto sm:px-6",
            "shadow-[0_0_0_1px_rgba(42,157,143,0.1)_inset,0_0.5px_0.5px_rgba(42,157,143,0.05)_inset,0_-0.5px_0.5px_rgba(42,157,143,0.05)_inset,0_1px_2px_rgba(42,157,143,0.1)]",
            "dark:shadow-[0_0_0_0.5px_rgba(231,111,81,0.06)_inset,0_0.5px_0.5px_rgba(231,111,81,0.1)_inset,0_-0.5px_0.5px_rgba(231,111,81,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]",
            "transition-all duration-300 ease-in-out"
          )}
        >
          <div className="flex items-center gap-2">
            <ModeToggle />
            <LanguageSelector />
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="sm:hidden bg-accent hover:bg-primary-teal/10 dark:hover:bg-secondary-coral/10 transition-colors duration-200"
                aria-label="Toggle Menu"
              >
                <div className={cn("hamburger", isSheetOpen ? "open" : "")}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="mobile-menu sm:max-w-[15rem] py-4 pl-1 border-r border-primary-teal/10 dark:border-secondary-coral/10 shadow-2xl"
            >
              <div className="flex gap-2 justify-end px-4 mt-4">
                <ModeToggle />
                <LanguageSelector />
              </div>
              <Button
                variant="ghost"
                className="absolute top-4 right-4"
                onClick={() => setSheetOpen(false)}
              >
                <X className="h-6 w-6 text-primary-teal dark:text-secondary-green" />
              </Button>

              <nav className="flex flex-col items-start gap-4 px-2 py-5">
                {pathname.includes("admin") ? (
                  <>
                    <LogoAnimationLink />
                    <AdminNav />
                  </>
                ) : (
                  <>
                    <ProductNav
                      tags={tags}
                      labels={labels}
                      categories={categories}
                      handleLinkClick={handleLinkClick}
                      searchParams={searchParams}
                    >
                      <div className="my-4 space-y-3">
                        <Link
                          href="/"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <HomeIcon className="h-5 w-5 text-primary-teal dark:text-secondary-green" />
                          {t("home")}
                        </Link>
                        <Link
                          href="/submit"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <PlusIcon className="h-5 w-5 text-primary-teal dark:text-secondary-green" />
                          {t("submit")}
                        </Link>

                        <Link
                          href="/scraper"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                          prefetch={false}
                          onClick={handleLinkClick}
                        >
                          <BoxIcon className="h-5 w-5 text-primary-teal dark:text-secondary-green" />
                          {t("aiScraper")}
                        </Link>

                        {!isSignedIn ? (
                          <SignInButton mode="modal">
                            <button
                              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                              onClick={handleLinkClick}
                            >
                              <LogIn className="h-5 w-5 text-primary-teal dark:text-secondary-green" />
                              {t("login")}
                            </button>
                          </SignInButton>
                        ) : (
                          <Link
                            href="/admin"
                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            prefetch={false}
                            onClick={handleLinkClick}
                          >
                            <UsersIcon className="h-5 w-5 text-primary-teal dark:text-secondary-green" />
                            {t("home")}
                          </Link>
                        )}
                      </div>
                    </ProductNav>
                  </>
                )}
              </nav>
              <div className="flex flex-col items-start pl-4">
                <nav className="mb-6 flex gap-4 ">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-primary-teal to-primary-light" />
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-gradient-to-t from-primary-teal/70 to-primary-light/80 rounded-lg"
                    >
                      <div className="p-[1px] bg-background rounded-md">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-primary-teal" />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-primary-teal" />
                        <DropdownMenuItem>
                          <SignOutButton>
                            <Button className="w-full">
                              <LogOutIcon className="mr-1 size-4" /> Logout
                            </Button>
                          </SignOutButton>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </>
  )
}

type ProductNavProps = {
  categories?: string[]
  tags?: string[]
  labels?: string[]
  handleLinkClick?: () => void
  searchParams: URLSearchParams
  children?: ReactNode
}

function ProductNav({
  categories,
  tags,
  labels,
  searchParams,
  handleLinkClick,
  children,
}: ProductNavProps) {
  const { t } = useLanguage();
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-full">
      <LogoAnimationLink />
      {children}
      <div className="my-4 space-y-3 pl-2 w-full">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-4 px-2.5 rounded-md py-2 transition-all duration-200 relative group",
            isActive("/") 
              ? "text-primary-teal dark:text-secondary-coral bg-primary-teal/10 dark:bg-secondary-coral/10 font-medium" 
              : "text-muted-foreground hover:text-foreground hover:bg-primary-teal/5 dark:hover:bg-secondary-coral/5"
          )}
          prefetch={false}
        >
          <HomeIcon className={cn(
            "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
            isActive("/") 
              ? "text-primary-teal dark:text-secondary-coral" 
              : "text-primary-teal/70 dark:text-secondary-coral/70"
          )} />
          {t("home")}
          {isActive("/") && (
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary-teal dark:bg-secondary-coral rounded-r-full" />
          )}
        </Link>
        <Link
          href="/submit"
          className={cn(
            "flex items-center gap-4 px-2.5 rounded-md py-2 transition-all duration-200 relative group",
            isActive("/submit") 
              ? "text-primary-teal dark:text-secondary-coral bg-primary-teal/10 dark:bg-secondary-coral/10 font-medium" 
              : "text-muted-foreground hover:text-foreground hover:bg-primary-teal/5 dark:hover:bg-secondary-coral/5"
          )}
          prefetch={false}
        >
          <PlusIcon className={cn(
            "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
            isActive("/submit") 
              ? "text-primary-teal dark:text-secondary-coral" 
              : "text-primary-teal/70 dark:text-secondary-coral/70"
          )} />
          {t("submit")}
          {isActive("/submit") && (
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary-teal dark:bg-secondary-coral rounded-r-full" />
          )}
        </Link>
        <Link
          href="/scraper"
          className={cn(
            "flex items-center gap-4 px-2.5 rounded-md py-2 transition-all duration-200 relative group",
            isActive("/scraper") 
              ? "text-primary-teal dark:text-secondary-coral bg-primary-teal/10 dark:bg-secondary-coral/10 font-medium" 
              : "text-muted-foreground hover:text-foreground hover:bg-primary-teal/5 dark:hover:bg-secondary-coral/5"
          )}
          prefetch={false}
        >
          <BoxIcon className={cn(
            "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
            isActive("/scraper") 
              ? "text-primary-teal dark:text-secondary-coral" 
              : "text-primary-teal/70 dark:text-secondary-coral/70"
          )} />
          {t("aiScraper")}
          {isActive("/scraper") && (
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary-teal dark:bg-secondary-coral rounded-r-full" />
          )}
        </Link>
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button
              className="flex items-center gap-4 px-2.5 rounded-md py-2 w-full text-left text-muted-foreground hover:text-foreground hover:bg-primary-teal/5 dark:hover:bg-secondary-coral/5 transition-all duration-200 group"
              onClick={handleLinkClick}
            >
              <LogIn className="h-5 w-5 text-primary-teal/70 dark:text-secondary-coral/70 transition-transform duration-300 group-hover:scale-110" />
              {t("login")}
            </button>
          </SignInButton>
        ) : (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-4 px-2.5 rounded-md py-2 transition-all duration-200 relative group",
              isActive("/admin") 
                ? "text-primary-teal dark:text-secondary-coral bg-primary-teal/10 dark:bg-secondary-coral/10 font-medium" 
                : "text-muted-foreground hover:text-foreground hover:bg-primary-teal/5 dark:hover:bg-secondary-coral/5"
            )}
            prefetch={false}
            onClick={handleLinkClick}
          >
            <UsersIcon className={cn(
              "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
              isActive("/admin") 
                ? "text-primary-teal dark:text-secondary-coral" 
                : "text-primary-teal/70 dark:text-secondary-coral/70"
            )} />
            {t("home")}
            {isActive("/admin") && (
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary-teal dark:bg-secondary-coral rounded-r-full" />
            )}
          </Link>
        )}

        {/* Categories Section */}
        {categories && categories.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-sm mb-2 text-primary-teal dark:text-secondary-coral flex items-center">
              <FolderOpenIcon className="h-4 w-4 mr-1.5" />
              Categories
            </h3>
            <ScrollArea className="h-[120px] pr-2">
              <div className="space-y-1">
                {categories.map((category) => {
                  const isSelected = searchParams.get('category') === category;
                  return (
                    <Link
                      key={category}
                      href={`/products?category=${encodeURIComponent(category)}`}
                      className={cn(
                        "flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md transition-all duration-200",
                        isSelected 
                          ? "bg-primary-teal/10 dark:bg-secondary-coral/10 text-primary-teal dark:text-secondary-coral font-medium" 
                          : "text-muted-foreground hover:text-foreground hover:bg-primary-teal/5 dark:hover:bg-secondary-coral/5"
                      )}
                      prefetch={false}
                      onClick={handleLinkClick}
                    >
                      <BoxIcon className={cn(
                        "h-3 w-3",
                        isSelected 
                          ? "text-primary-teal dark:text-secondary-coral" 
                          : "text-primary-teal/70 dark:text-secondary-coral/70"
                      )} />
                      {truncateString(category, 20)}
                    </Link>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Tags Section */}
        {tags && tags.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-sm mb-2 text-primary-teal dark:text-secondary-coral flex items-center">
              <TagIcon className="h-4 w-4 mr-1.5" />
              Tags
            </h3>
            <ScrollArea className="h-[120px] pr-2">
              <div className="space-y-1">
                {tags.map((tag) => {
                  const isSelected = searchParams.get('tag') === tag;
                  return (
                    <Link
                      key={tag}
                      href={`/products?tag=${encodeURIComponent(tag)}`}
                      className={cn(
                        "flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md transition-all duration-200",
                        isSelected 
                          ? "bg-primary-teal/10 dark:bg-secondary-coral/10 text-primary-teal dark:text-secondary-coral font-medium" 
                          : "text-muted-foreground hover:text-foreground hover:bg-primary-teal/5 dark:hover:bg-secondary-coral/5"
                      )}
                      prefetch={false}
                      onClick={handleLinkClick}
                    >
                      <TagIcon className={cn(
                        "h-3 w-3",
                        isSelected 
                          ? "text-primary-teal dark:text-secondary-coral" 
                          : "text-primary-teal/70 dark:text-secondary-coral/70"
                      )} />
                      {truncateString(tag, 20)}
                    </Link>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Labels Section */}
        {labels && labels.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-sm mb-2 text-primary-teal dark:text-secondary-coral flex items-center">
              <Hash className="h-4 w-4 mr-1.5" />
              Labels
            </h3>
            <ScrollArea className="h-[120px] pr-2">
              <div className="space-y-1">
                {labels.map((label) => {
                  const isSelected = searchParams.get('label') === label;
                  return (
                    <Link
                      key={label}
                      href={`/products?label=${encodeURIComponent(label)}`}
                      className={cn(
                        "flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md transition-all duration-200",
                        isSelected 
                          ? "bg-primary-teal/10 dark:bg-secondary-coral/10 text-primary-teal dark:text-secondary-coral font-medium" 
                          : "text-muted-foreground hover:text-foreground hover:bg-primary-teal/5 dark:hover:bg-secondary-coral/5"
                      )}
                      prefetch={false}
                      onClick={handleLinkClick}
                    >
                      <Hash className={cn(
                        "h-3 w-3",
                        isSelected 
                          ? "text-primary-teal dark:text-secondary-coral" 
                          : "text-primary-teal/70 dark:text-secondary-coral/70"
                      )} />
                      {truncateString(label, 20)}
                    </Link>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
