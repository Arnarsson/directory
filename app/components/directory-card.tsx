// @ts-nocheck
import { useState, ReactElement, ReactNode } from 'react'
import { FC } from 'react'

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
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {image && (
          <div className="w-full md:w-1/3 relative">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-48 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
