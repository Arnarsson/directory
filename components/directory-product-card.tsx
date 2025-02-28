"use client"

import { useOptimistic, startTransition } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Tag, Eye } from "lucide-react"

import { cn } from "@/lib/utils"
import MinimalCard, {
  MinimalCardContent,
  MinimalCardDescription,
  MinimalCardFooter,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/cult/minimal-card"
import { incrementClickCount } from "@/app/actions/product"

export const getBasePath = (url: string) => {
  return new URL(url).hostname.replace("www.", "").split(".")[0]
}

export const getLastPathSegment = (url: string, maxLength: number): string => {
  try {
    const pathname = new URL(url).pathname
    const segments = pathname.split("/").filter(Boolean)
    const lastSegment = segments.pop() || ""

    if (lastSegment.length > maxLength) {
      return `/${lastSegment.substring(0, maxLength)}`
    }

    return lastSegment ? `/${lastSegment}` : ""
  } catch (error) {
    console.error("Invalid URL:", error)
    return ""
  }
}

interface Product {
  id: string
  created_at: string
  full_name: string
  email: string
  twitter_handle: string
  product_website: string
  codename: string
  punchline: string
  description: string
  logo_src: string
  user_id: string
  tags: string[]
  view_count: number
  approved: boolean
  labels: string[]
  categories: string
}

export const ProductLink: React.FC<{
  trim?: boolean
  data: Product
  order: any
  isFeatured?: boolean
}> = ({ data, order, isFeatured }) => {
  const [optimisticResource, addOptimisticUpdate] = useOptimistic<
    Product,
    Partial<Product>
  >(data, (currentResource, newProperties) => {
    return { ...currentResource, ...newProperties }
  })

  const handleClick = () => {
    const newClickCount = (optimisticResource.view_count || 0) + 1
    startTransition(() => {
      addOptimisticUpdate({ view_count: newClickCount })
    })
    incrementClickCount(data.id)
  }

  const url = isFeatured ? `"https://ethos-ai.cc"` : `/products/${data.id}`

  return (
    <motion.div
      key={`resource-card-${data.id}-${order}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 15, 
        delay: order * 0.05 
      }}
      whileHover={{ 
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 15 }
      }}
      className="group relative break-inside-avoid w-full"
    >
      <div className="w-full transform transition-all duration-300 hover:scale-[1.02]">
        <Link
          href={url || `/products/${data.id}`}
          key={`/products/${data.id}`}
          onClick={handleClick}
          className="block focus:outline-none focus:ring-2 focus:ring-primary-teal/50 dark:focus:ring-secondary-coral/50"
        >
          <ResourceCard
            data={data}
            view_count={optimisticResource.view_count}
          />
        </Link>
      </div>
    </motion.div>
  )
}

export const FeaturedExternalLink: React.FC<{
  trim?: boolean
  data: Product
  order: any
}> = ({ data, order }) => {
  return (
    <motion.div
      key={`resource-card-${data.id}-${order}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 15, 
        delay: order * 0.05 
      }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 15 }
      }}
      className="group relative break-inside-avoid w-full"
    >
      <div className="w-full transform transition-all duration-300">
        <a
          href={data.product_website}
          target="_blank"
          rel="noreferrer noopener"
          className="block focus:outline-none focus:ring-2 focus:ring-primary-teal/50 dark:focus:ring-secondary-coral/50"
        >
          <ResourceCard data={data} view_count={0} trim={true} isFeatured={true} />
        </a>
      </div>
    </motion.div>
  )
}

function ResourceCard({
  data,
  view_count,
  trim = false,
  isFeatured = false,
}: {
  data: Product
  view_count: number
  trim?: boolean
  isFeatured?: boolean
}) {
  return (
    <MinimalCard className={cn(
      "w-full border border-primary-teal/10 dark:border-secondary-coral/10 overflow-hidden",
      "group-hover:border-primary-teal/30 dark:group-hover:border-secondary-coral/30",
      "transition-all duration-300 ease-in-out",
      isFeatured 
        ? "bg-gradient-to-br from-primary-teal/5 to-primary-light/5 dark:from-secondary-coral/5 dark:to-secondary-light/5" 
        : ""
    )}>
      {data.logo_src ? (
        <div className="relative overflow-hidden">
          <MinimalCardImage alt={data.codename} src={data.logo_src} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-teal/20 to-transparent dark:from-secondary-coral/20 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          
          {/* Shine effect on hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
              backgroundSize: '200% 200%',
              animation: 'shine 1.5s ease-in-out infinite alternate'
            }}
          />
        </div>
      ) : null}

      <MinimalCardTitle className="font-bold mb-1 text-gray-800 dark:text-gray-100 group-hover:text-primary-teal dark:group-hover:text-secondary-coral transition-colors duration-200">
        {data.codename.substring(0, 30)}
      </MinimalCardTitle>
      
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mb-2"
      >
        <span className="text-xs leading-4 text-primary-teal/70 dark:text-secondary-coral/70 font-medium">
          {getLastPathSegment(data.product_website, 10)}
        </span>
        <span className="mx-1 text-gray-400">•</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 italic">
          {data.categories ? data.categories.split(',')[0] : ''}
        </span>
      </motion.div>
      
      <MinimalCardDescription className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200">
        {trim ? `${data.description.slice(0, 82)}...` : data.description}
      </MinimalCardDescription>

      <MinimalCardContent />
      
      <MinimalCardFooter>
        <motion.div
          initial={{ opacity: 0.8 }}
          whileHover={{ scale: 1.05 }}
          className={cn(
            "py-1.5 px-2 flex items-center gap-1 absolute bottom-2 left-2",
            view_count > 1 ? "block" : "hidden",
            "bg-primary-teal/5 dark:bg-secondary-coral/5 text-primary-teal dark:text-secondary-coral",
            "group-hover:bg-primary-teal/10 dark:group-hover:bg-secondary-coral/10 transition-colors duration-200"
          )}
        >
          <Eye className="h-3 w-3" />
          <p className="flex items-center tracking-tight text-xs font-medium">
            {view_count || data.view_count}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0.8 }}
          whileHover={{ scale: 1.05 }}
          className="py-1.5 px-2 flex items-center gap-1 absolute bottom-2 right-2 bg-primary-teal/5 dark:bg-secondary-coral/5 text-primary-teal dark:text-secondary-coral group-hover:bg-primary-teal/10 dark:group-hover:bg-secondary-coral/10 transition-colors duration-200"
        >
          <Tag className="h-3 w-3" />
          <p className="flex items-center tracking-tight text-xs font-medium">
            {data.labels && data.labels.length > 0 ? data.labels[0] : 'Tool'}
          </p>
        </motion.div>
      </MinimalCardFooter>
    </MinimalCard>
  )
}
