"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { PlusIcon, Twitter, ArrowRightIcon, SparklesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/language-context"

import { Button } from "./ui/button"
import { NextIcon, SupabaseIcon } from "./ui/icons"

export function Hero({ children }: { children?: React.ReactNode }) {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  }
  
  if (!mounted) return null
  
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="flex flex-col items-center md:items-start md:px-2 justify-center gap-4 md:ml-12 py-8 md:py-12"
    >
      <motion.div 
        variants={item}
        className="flex flex-col md:flex-row items-center md:items-end space-y-2 md:space-y-0 md:space-x-4"
      >
        <h1 className="text-5xl md:text-7xl font-black text-center md:text-left bg-gradient-to-r from-primary-teal to-primary-light dark:from-secondary-coral dark:to-secondary-light bg-clip-text text-transparent relative">
          {t("ethos")}
          <motion.div 
            className="absolute -top-6 -right-6 text-primary-teal/30 dark:text-secondary-coral/30"
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <SparklesIcon className="h-8 w-8" />
          </motion.div>
        </h1>
        <Badge
          variant="outline"
          className="border border-primary-teal/20 dark:border-secondary-coral/20 shadow-md backdrop-blur-sm"
        >
          <motion.span 
            className="h-2 w-2 bg-primary-teal dark:bg-secondary-coral rounded-full mr-2"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          {t("premiumAiDirectory")}
        </Badge>
      </motion.div>
      
      <motion.div 
        variants={item}
        className="flex flex-col items-center md:items-start md:mt-6 max-w-2xl"
      >
        <Badge className="mb-3 shadow-lg" variant="default">
          <span className="text-black dark:text-black font-semibold">ethos-ai.cc</span>
        </Badge>
        
        <div className="flex w-full items-center justify-center md:justify-start">
          <motion.div
            animate={{ 
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1, 1.05, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <NextIcon className="hidden md:block size-5 text-primary-teal dark:text-secondary-coral" />
          </motion.div>
          <span className="mx-2 text-xl md:text-2xl font-bold text-center md:text-left">
            {t("aiToolsResourcesDirectory")}
          </span>
          <motion.div
            animate={{ 
              rotate: [0, -5, 0, 5, 0],
              scale: [1, 1.05, 1, 1.05, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          >
            <SupabaseIcon className="hidden md:block size-5 text-primary-teal dark:text-secondary-coral" />
          </motion.div>
        </div>
        
        <motion.p 
          variants={item}
          className="mt-4 text-center md:text-left text-muted-foreground text-sm md:text-base px-2 leading-relaxed"
        >
          {t("discoverBestAiTools")}
          <motion.span 
            className="inline-block text-primary-teal/70 dark:text-secondary-coral/70 font-medium"
            whileHover={{ scale: 1.05 }}
          > {t("explore")}</motion.span>
          <motion.span 
            className="inline-block text-primary-teal/80 dark:text-secondary-coral/80 font-medium"
            whileHover={{ scale: 1.05 }}
          > &gt; {t("learn")}</motion.span>
          <motion.span 
            className="inline-block text-primary-teal dark:text-secondary-coral font-medium"
            whileHover={{ scale: 1.05 }}
          > &gt; {t("innovate")}</motion.span>
        </motion.p>
      </motion.div>
      
      <motion.div 
        variants={item}
        className="flex flex-col sm:flex-row mt-6 mb-4 space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto"
      >
        <Button 
          variant="default" 
          className="bg-gradient-to-r from-primary-teal to-primary-light hover:from-primary-light hover:to-primary-teal text-white dark:bg-gradient-to-r dark:from-secondary-coral dark:to-secondary-light dark:hover:from-secondary-light dark:hover:to-secondary-coral dark:text-black shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          asChild
        >
          <Link href="/submit" className="flex items-center justify-center group">
            <PlusIcon className="size-4 mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
            <span>{t("submitTool")}</span>
            <ArrowRightIcon className="ml-2 size-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          className="border-primary-teal/30 dark:border-secondary-coral/30 hover:border-primary-teal dark:hover:border-secondary-coral shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-primary-teal/5 dark:hover:bg-secondary-coral/5"
          asChild
        >
          <a
            href="https://x.com/nolansym"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center group"
          >
            <Twitter className="size-4 mr-2 text-primary-teal dark:text-secondary-coral group-hover:rotate-12 transition-transform duration-300" />
            <span>{t("updates")}</span>
          </a>
        </Button>
      </motion.div>
      
      <motion.div 
        variants={item}
        className="w-full md:w-auto"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
