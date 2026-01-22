"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null
    success: boolean
  }>
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{
    error: Error | null
    success: boolean
  }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{
    error: Error | null
    success: boolean
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Use a ref to store the Supabase client to avoid recreating it on every render
  const supabase = getSupabaseClient()
  const isInitialized = useRef(false)

  useEffect(() => {
    // Evitar múltiplas inicializações
    if (isInitialized.current) return
    isInitialized.current = true

    // Fetch the session only once when the component mounts
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error fetching session:", error)
        } else {
          setSession(data.session)
          setUser(data.session?.user ?? null)
        }
      } catch (error) {
        console.error("Unexpected error fetching session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()

    // Set up the auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setIsLoading(false)
    })

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe()
    }
  }, []) // Empty dependency array ensures this runs only once

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error, success: false }
      }

      router.push("/dashboard")
      router.refresh()
      return { error: null, success: true }
    } catch (error) {
      return { error: error as Error, success: false }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        return { error, success: false }
      }

      // Após o cadastro, faça login automaticamente
      return await signIn(email, password)
    } catch (error) {
      return { error: error as Error, success: false }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return { error, success: false }
      }

      return { error: null, success: true }
    } catch (error) {
      return { error: error as Error, success: false }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
