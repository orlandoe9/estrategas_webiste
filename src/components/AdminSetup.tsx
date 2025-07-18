
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export const AdminSetup = () => {
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const createAdminAccount = async () => {
    setIsCreating(true)
    
    try {
      // Create admin account with preset credentials
      const { data, error } = await supabase.auth.signUp({
        email: "admin@estrategas.com",
        password: "admin123456",
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: "Admin",
          },
        },
      })

      if (error) {
        // If user already exists, try to sign in instead
        if (error.message.includes("already registered")) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: "admin@estrategas.com",
            password: "admin123456",
          })
          
          if (signInError) throw signInError
          
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión como administrador.",
          })
        } else {
          throw error
        }
      } else {
        toast({
          title: "Cuenta de administrador creada",
          description: "Email: admin@estrategas.com | Password: admin123456",
        })
      }
    } catch (error: any) {
      console.error('Error creating admin account:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Configuración de Administrador</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Credenciales de administrador:</p>
          <p><strong>Email:</strong> admin@estrategas.com</p>
          <p><strong>Password:</strong> admin123456</p>
        </div>
        
        <Button 
          onClick={createAdminAccount}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? "Creando cuenta..." : "Crear/Iniciar como Admin"}
        </Button>
        
        <div className="text-xs text-muted-foreground">
          <p>Esta acción creará una cuenta de administrador o iniciará sesión si ya existe.</p>
        </div>
      </CardContent>
    </Card>
  )
}
