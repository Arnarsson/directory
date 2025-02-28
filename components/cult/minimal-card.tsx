import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

// Add shine animation to global styles
const shineAnimation = `
@keyframes shine {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`;

// Add the animation style to the document if it doesn't exist
if (typeof document !== 'undefined') {
  const styleId = 'shine-animation-style';
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = shineAnimation;
    document.head.appendChild(styleElement);
  }
}

const MinimalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "dark:bg-neutral-800 bg-white p-3 no-underline transition-all duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/90",
      "shadow-[0_0_0_1px_rgba(42,157,143,0.05),0_2px_4px_rgba(42,157,143,0.05)]",
      "dark:shadow-[0_0_0_1px_rgba(231,111,81,0.03),0_2px_4px_rgba(0,0,0,0.2)]",
      "hover:shadow-[0_0_0_1px_rgba(42,157,143,0.1),0_4px_8px_rgba(42,157,143,0.1)]",
      "dark:hover:shadow-[0_0_0_1px_rgba(231,111,81,0.05),0_4px_8px_rgba(0,0,0,0.3)]",
      "backdrop-blur-sm",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
MinimalCard.displayName = "MinimalCard"

const MinimalCardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src: string; alt: string }
>(({ className, alt, src, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-[190px] w-full mb-4 overflow-hidden",
      "shadow-[0_0_0_1px_rgba(42,157,143,0.1)]",
      "dark:shadow-[0_0_0_1px_rgba(231,111,81,0.05)]",
      className
    )}
    {...props}
  >
    <img
      src={src}
      alt={alt}
      width={200}
      height={200}
      className="object-cover absolute h-full w-full inset-0 transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0">
      <div
        className={cn(
          "absolute inset-0",
          "shadow-[0_0_0_1px_rgba(42,157,143,0.05),0_0_0_3px_rgba(255,255,255,0.8),0_0_0_4px_rgba(42,157,143,0.05)]",
          "dark:shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_0_0_3px_rgba(231,111,81,0.05),0_0_0_4px_rgba(0,0,0,0.1)]"
        )}
      />
    </div>
  </div>
))
MinimalCardImage.displayName = "MinimalCardImage"

const MinimalCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg mt-1 font-bold text-foreground leading-tight px-1 transition-all duration-300",
      "group-hover:translate-x-0.5 transform",
      className
    )}
    {...props}
  />
))
MinimalCardTitle.displayName = "MinimalCardTitle"

const MinimalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground pb-2 px-1 leading-relaxed", 
      "transition-colors duration-300",
      className
    )}
    {...props}
  />
))
MinimalCardDescription.displayName = "MinimalCardDescription"

const MinimalCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
))
MinimalCardContent.displayName = "MinimalCardContent"

const MinimalCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
))
MinimalCardFooter.displayName = "MinimalCardFooter"

export {
  MinimalCard,
  MinimalCardImage,
  MinimalCardTitle,
  MinimalCardDescription,
  MinimalCardContent,
  MinimalCardFooter,
}

export default MinimalCard
