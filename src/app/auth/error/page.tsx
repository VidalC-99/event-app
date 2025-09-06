import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

interface AuthErrorPageProps {
  searchParams: Promise<{ error?: string; error_description?: string }>
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams
  const error = params.error
  const errorDescription = params.error_description

  const getErrorMessage = (error?: string) => {
    switch (error) {
      case "access_denied":
        return "Accès refusé. Vous avez annulé la connexion."
      case "server_error":
        return "Erreur serveur. Veuillez réessayer plus tard."
      case "temporarily_unavailable":
        return "Service temporairement indisponible."
      default:
        return errorDescription || "Une erreur inattendue s'est produite."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Erreur d'authentification</CardTitle>
            <CardDescription>Un problème est survenu lors de la connexion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button asChild>
                <Link href="/src/app/auth/login">Réessayer la connexion</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/public">Retour à l'accueil</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
