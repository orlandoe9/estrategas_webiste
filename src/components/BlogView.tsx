
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, User, ArrowLeft, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"

export const BlogView = () => {
  const { id } = useParams<{ id: string }>()
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return

      try {
        // Fetch the blog post
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .eq('published', true)
          .single()

        if (postError) throw postError

        // Fetch author profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', postData.author_id)
          .single()

        // Fetch section name
        const { data: section } = await supabase
          .from('custom_sections')
          .select('name')
          .eq('id', postData.section_id)
          .single()

        setBlog({
          ...postData,
          profiles: profile || null,
          custom_sections: section || null
        })
      } catch (error) {
        console.error('Error fetching blog:', error)
        setError('No se pudo cargar el artículo')
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-muted rounded-lg h-64 mb-8"></div>
            <div className="bg-muted rounded h-8 mb-4"></div>
            <div className="bg-muted rounded h-4 mb-2"></div>
            <div className="bg-muted rounded h-4 w-2/3 mb-8"></div>
            <div className="space-y-4">
              <div className="bg-muted rounded h-4"></div>
              <div className="bg-muted rounded h-4"></div>
              <div className="bg-muted rounded h-4 w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Artículo no encontrado
            </h1>
            <p className="text-muted-foreground mb-8">
              {error || 'El artículo que buscas no existe o ha sido eliminado.'}
            </p>
            <Link to="/articles">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Artículos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(blog.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-8">
          <Link to="/articles">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Artículos
            </Button>
          </Link>
        </div>

        {/* Hero image */}
        {blog.images && blog.images.length > 0 && (
          <div className="relative mb-8 rounded-lg overflow-hidden">
            <img
              src={blog.images[0]}
              alt={blog.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            {blog.custom_sections?.name && (
              <div className="absolute top-6 left-6">
                <Badge className="sports-gradient text-primary-foreground">
                  <Tag className="h-4 w-4 mr-1" />
                  {blog.custom_sections.name}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Article header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {blog.title}
          </h1>
          
          {blog.excerpt && (
            <p className="text-lg text-muted-foreground mb-6">
              {blog.excerpt}
            </p>
          )}

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            {blog.profiles?.display_name && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{blog.profiles.display_name}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Article content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Back to articles button */}
        <div className="mt-12 pt-8 border-t">
          <Link to="/articles">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Artículos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
