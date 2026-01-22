"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"

interface SettingsContextType {
  companyName: string
  setCompanyName: (name: string) => void
  logoUrl: string
  setLogoUrl: (url: string) => void
  saveSettings: () => void
}

const defaultSettings = {
  companyName: "Orlando Rental Strollers",
  logoUrl: "/logo.png",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [companyName, setCompanyName] = useState(defaultSettings.companyName)
  const [logoUrl, setLogoUrl] = useState(defaultSettings.logoUrl)
  const isInitialized = useRef(false)

  // Carregar configurações do localStorage quando o componente montar
  useEffect(() => {
    // Evitar múltiplas inicializações
    if (isInitialized.current) return
    isInitialized.current = true

    try {
      if (typeof window !== "undefined") {
        const savedSettings = localStorage.getItem("appSettings")
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          setCompanyName(parsedSettings.companyName || defaultSettings.companyName)
          setLogoUrl(parsedSettings.logoUrl || defaultSettings.logoUrl)
        }
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error)
    }
  }, [])

  const saveSettings = () => {
    try {
      if (typeof window !== "undefined") {
        const settings = {
          companyName,
          logoUrl,
        }
        localStorage.setItem("appSettings", JSON.stringify(settings))
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        companyName,
        setCompanyName,
        logoUrl,
        setLogoUrl,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
