"use client"

import { Heart, Calendar, Users, QrCode, Settings, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {useAuth} from "@/hooks/use-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { name: "Événements", href: "/events", icon: Calendar },
  { name: "Invités", href: "/guests", icon: Users },
  { name: "Scanner QR", href: "/security/scan", icon: QrCode },
  { name: "Paramètres de mariage", href: "/settings", icon: Settings },
];

export function Navigation() {
  const { user, signOut } = useAuth();

  const pathname = usePathname();
  
  return (
    <header className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">WeddingApp</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth",
                  pathname?.startsWith(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {/* Desktop user area */}
            <div className="hidden md:flex items-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-rose text-white">
                            {(user?.email?.charAt(0) || "?").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground max-w-[220px] truncate">
                          {user?.email}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      Connecté en tant que
                      <div className="font-medium text-foreground truncate">{user?.email}</div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/settings" className="w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={signOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost">
                    <Link href="/auth/login">Se connecter</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/sign-up">S'inscrire</Link>
                  </Button>
                </div>
              )}
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[380px] p-4">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      WeddingApp
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 flex flex-col gap-1">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                          pathname?.startsWith(item.href)
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 border-t pt-4">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-gradient-rose text-white">
                              {(user?.email?.charAt(0) || "?").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{user?.email || "Utilisateur"}</div>
                            <div className="text-xs text-muted-foreground truncate">Connecté</div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" className="w-full" asChild>
                            <Link href="/settings" className="flex-1">
                              <Settings className="h-4 w-4 mr-2" />
                              Paramètres de mariage
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={signOut}
                            className="flex-1"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Déconnexion
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex gap-2">
                        <Button asChild variant="outline" className="flex-1">
                          <Link href="/auth/login">Se connecter</Link>
                        </Button>
                        <Button asChild className="flex-1">
                          <Link href="/auth/sign-up">S'inscrire</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}