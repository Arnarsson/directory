// @ts-nocheck
import { useState, ReactElement, ReactNode } from 'react'
import { FC } from 'react'
import Image from 'next/image'
import { FallbackImage } from '@/components/cult/fallback-image'

interface DirectoryCardProps {
  id: string
  title: string
  description: string
  tags: string[]
  image?: string
  children?: ReactNode
}

export const DirectoryCard: FC<DirectoryCardProps> = ({
  id,
  title,
  description,
  tags,
  image,
  children
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-primary-teal/10 dark:border-secondary-coral/10 
      shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {image && (
          <div className="w-full h-48 relative">
            <FallbackImage
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-primary-teal/10 to-transparent dark:from-secondary-coral/10 
              transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-50'}`} />
          </div>
        )}
        {!image && (
          <div className="w-full h-32 bg-gradient-to-r from-primary-teal/5 to-primary-light/5 
            dark:from-secondary-coral/5 dark:to-secondary-light/5 flex items-center justify-center">
            <span className="text-primary-teal/50 dark:text-secondary-coral/50 font-medium">No Image</span>
          </div>
        )}
        
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100 group-hover:text-primary-teal dark:group-hover:text-secondary-coral">
            {title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary-teal/10 dark:bg-secondary-coral/10 
                  text-primary-teal dark:text-secondary-coral rounded-full text-sm font-medium
                  border border-primary-teal/20 dark:border-secondary-coral/20
                  hover:bg-primary-teal/20 dark:hover:bg-secondary-coral/20 transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
