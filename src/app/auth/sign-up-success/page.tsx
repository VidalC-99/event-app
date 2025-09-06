import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Inscription réussie !</CardTitle>
            <CardDescription>Vérifiez votre email pour confirmer votre compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Nous avons envoyé un email de confirmation à votre adresse. Cliquez sur le lien dans l'email pour activer
              votre compte.
            </p>
            <div className="flex flex-col space-y-2">
              <Button asChild>
                <Link href="/src/app/auth/login">Retour à la connexion</Link>
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
