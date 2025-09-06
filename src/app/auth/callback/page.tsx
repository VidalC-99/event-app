"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import supabase from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {

      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/auth/error?message=" + encodeURIComponent(error.message))
          return
        }

        if (data.session) {
          // User is authenticated, redirect to protected area
          router.push("/protected")
        } else {
          // No session, redirect to login
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        router.push("/auth/error?message=" + encodeURIComponent("Une erreur inattendue est survenue"))
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Finalisation de la connexion...</p>
      </div>
    </div>
  )
}
