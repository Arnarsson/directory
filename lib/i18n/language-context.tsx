"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TranslationKey, getTranslation } from './translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  translateContent: (content: string) => Promise<string>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Default to Danish
  const [language, setLanguage] = useState<Language>('da');

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  // Function to translate arbitrary content using an API
  const translateContent = async (content: string): Promise<string> => {
    if (language === 'en') return content; // No translation needed for English

    try {
      // In a real implementation, you would call a translation API here
      // For demo purposes, we'll just return the content with a prefix
      return `[Translated to Danish] ${content}`;
      
      // Example of how you might implement this with a real API:
      // const response = await fetch('/api/translate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: content, targetLanguage: language }),
      // });
      // const data = await response.json();
      // return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return content; // Fallback to original content
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateContent }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
