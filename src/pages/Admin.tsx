import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Edit, Trash2, Eye, EyeOff, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"

interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  image_url?: string
  published: boolean
  created_at: string
  section_id?: string
  profiles?: { display_name: string } | null
}

interface Section {
  id: string
  name: string
  description?: string
}

const Admin = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    image_url: "",
    section_id: "",
    published: false
  })
  const { toast } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      navigate("/auth")
      return
    }
    fetchUserProfile()
    fetchData()
  }, [user, navigate])

  const fetchUserProfile = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      setUserProfile(data)
      
      if (data.role !== 'admin') {
        navigate("/")
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos para acceder al panel de administración",
          variant: "destructive",
        })
        return
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      navigate("/")
    }
  }

  const fetchData = async () => {
    try {
      // Fetch articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (articlesError) throw articlesError
      
      // Fetch author profiles separately
      const articlesWithProfiles = await Promise.all(
        (articlesData || []).map(async (article) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', article.author_id)
            .single()
          
          return {
            ...article,
            profiles: profile
          }
        })
      )
      
      setArticles(articlesWithProfiles as Article[])

      // Fetch sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('custom_sections')
        .select('*')
        .order('name', { ascending: true })

      if (sectionsError) throw sectionsError
      setSections(sectionsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const articleData = {
        ...formData,
        author_id: user.id,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + "..."
      }

      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id)

        if (error) throw error
        toast({ title: "Artículo actualizado exitosamente" })
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData])

        if (error) throw error
        toast({ title: "Artículo creado exitosamente" })
      }

      setIsDialogOpen(false)
      setEditingArticle(null)
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        image_url: "",
        section_id: "",
        published: false
      })
      fetchData()
    } catch (error) {
      console.error('Error saving article:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar el artículo",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || "",
      image_url: article.image_url || "",
      section_id: article.section_id || "",
      published: article.published
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este artículo?")) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast({ title: "Artículo eliminado exitosamente" })
      fetchData()
    } catch (error) {
      console.error('Error deleting article:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el artículo",
        variant: "destructive",
      })
    }
  }

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ published: !currentStatus })
        .eq('id', id)

      if (error) throw error
      toast({ 
        title: !currentStatus ? "Artículo publicado" : "Artículo despublicado" 
      })
      fetchData()
    } catch (error) {
      console.error('Error updating article:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el artículo",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Panel de Administración</h1>
              <p className="text-white/90">Gestiona tu contenido deportivo</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => {
                    setEditingArticle(null)
                    setFormData({
                      title: "",
                      content: "",
                      excerpt: "",
                      image_url: "",
                      section_id: "",
                      published: false
                    })
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Artículo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingArticle ? "Editar Artículo" : "Crear Nuevo Artículo"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Título del artículo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Categoría</Label>
                      <Select 
                        value={formData.section_id} 
                        onValueChange={(value) => handleInputChange("section_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                              {section.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">URL de Imagen</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange("image_url", e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Resumen</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      placeholder="Breve descripción del artículo"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Contenido *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      placeholder="Escribe el contenido completo del artículo aquí..."
                      rows={12}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => handleInputChange("published", checked)}
                    />
                    <Label htmlFor="published">Publicar inmediatamente</Label>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-gradient-primary">
                      {editingArticle ? "Actualizar" : "Crear"} Artículo
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="hover-scale transition-smooth">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Por: {article.profiles?.display_name || "Autor"}</span>
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      <Badge variant={article.published ? "default" : "secondary"}>
                        {article.published ? "Publicado" : "Borrador"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublished(article.id, article.published)}
                    >
                      {article.published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(article)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {article.excerpt && (
                <CardContent>
                  <p className="text-muted-foreground">{article.excerpt}</p>
                </CardContent>
              )}
            </Card>
          ))}

          {articles.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No hay artículos</h3>
              <p className="text-muted-foreground mb-4">
                Comienza creando tu primer artículo deportivo
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Artículo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin