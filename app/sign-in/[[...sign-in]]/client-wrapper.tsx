"use client"

import { SignIn } from "@clerk/nextjs"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSelector } from "@/components/language-selector"

export function SignInClientWrapper() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t("signInToEthos")}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("welcomeBack")}
        </p>
      </div>
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: "button",
            card: "shadow-md rounded-lg",
          }
        }}
      />
    </div>
  )
}
