import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroButton } from "@/components/ui/hero-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface NavigationBarProps {
  user?: any
  userProfile?: any
}

export const NavigationBar = ({ user, userProfile }: NavigationBarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { toast } = useToast()

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Artículos", href: "/articles" },
    { name: "Nosotros", href: "/about" },
    { name: "Contacto", href: "/contact" },
  ]

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      })
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-card/95 backdrop-blur-md sticky top-0 z-50 border-b border-border elegant-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/019e4c4d-0e97-4cc1-aceb-e59ef13e31ee.png" 
              alt="Estrategas" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold sports-gradient bg-clip-text text-transparent">
              Estrategas
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {userProfile?.display_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {userProfile?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <HeroButton size="sm">Iniciar Sesión</HeroButton>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      {userProfile?.display_name || user.email}
                    </div>
                    {userProfile?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2"
                  >
                    <HeroButton size="sm" className="w-full">
                      Iniciar Sesión
                    </HeroButton>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}