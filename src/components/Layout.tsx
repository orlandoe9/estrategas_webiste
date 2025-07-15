import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { NavigationBar } from "@/components/ui/navigation-bar"
import { Footer } from "@/components/ui/footer"
import { supabase } from "@/integrations/supabase/client"

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, loading } = useAuth()
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (error) throw error
          setUserProfile(data)
        } catch (error) {
          console.error('Error fetching profile:', error)
        }
      }

      fetchProfile()
    } else {
      setUserProfile(null)
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavigationBar user={user} userProfile={userProfile} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}