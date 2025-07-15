import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Trophy, Target, Users, TrendingUp } from "lucide-react"
import { HeroButton } from "@/components/ui/hero-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArticleCard } from "@/components/ui/article-card"
import { supabase } from "@/integrations/supabase/client"

export default function Home() {
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const { data: articles, error } = await supabase
          .from('articles')
          .select('*, profiles(display_name)')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(6)

        if (error) throw error
        setFeaturedArticles(articles || [])
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedArticles()
  }, [])

  const features = [
    {
      icon: Trophy,
      title: "Análisis Experto",
      description: "Análisis profundo de estrategias deportivas y tácticas avanzadas"
    },
    {
      icon: Target,
      title: "Contenido Exclusivo",
      description: "Acceso a contenido premium y análisis exclusivos del mundo deportivo"
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Únete a nuestra comunidad de apasionados por el deporte y las estrategias"
    },
    {
      icon: TrendingUp,
      title: "Últimas Tendencias",
      description: "Mantente al día con las últimas tendencias y novedades deportivas"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">Estrategias</span>
            <span className="block text-white/90">Deportivas</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Descubre análisis expertos, estrategias avanzadas y contenido exclusivo 
            del mundo deportivo profesional
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/articles">
              <HeroButton size="xl" className="bg-white text-primary hover:bg-white/90">
                Explorar Artículos
                <ArrowRight className="ml-2 h-5 w-5" />
              </HeroButton>
            </Link>
            <Link to="/about">
              <HeroButton variant="hero-outline" size="xl" className="border-white text-white hover:bg-white hover:text-primary">
                Conoce Más
              </HeroButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Por qué elegir Estrategas?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Somos más que un blog deportivo. Somos tu fuente confiable de 
              análisis estratégicos y contenido de calidad premium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-smooth hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4 w-12 h-12 sports-gradient rounded-lg flex items-center justify-center group-hover:shadow-lg transition-smooth">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Artículos Destacados
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Los últimos análisis y estrategias del mundo deportivo
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-64 mb-4"></div>
                  <div className="bg-muted rounded h-4 mb-2"></div>
                  <div className="bg-muted rounded h-4 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    imageUrl={article.image_url}
                    authorName={article.profiles?.display_name}
                    publishedAt={article.created_at}
                    isPublished={article.published}
                  />
                ))}
              </div>

              <div className="text-center">
                <Link to="/articles">
                  <HeroButton variant="hero-outline" size="lg">
                    Ver Todos los Artículos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </HeroButton>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}