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

interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  images?: string[]
  published: boolean
  created_at: string
  section_id?: string
  author_id: string
  profiles?: { display_name: string } | null
}

interface Section {
  id: string
  name: string
  description?: string
}

const Admin = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    images: [] as string[],
    section_id: "",
    published: false
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const { toast } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    fetchUserProfile()
    fetchData()
  }, [])

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
      // Fetch blogs (posts) with manual join to avoid foreign key issues
      const { data: blogsData, error: blogsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (blogsError) throw blogsError

      // Fetch author profiles separately and join manually
      const blogsWithProfiles = await Promise.all(
        (blogsData || []).map(async (blog) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', blog.author_id)
            .single()
          
          return {
            ...blog,
            profiles: profile || null
          }
        })
      )
      
      setBlogs(blogsWithProfiles as Blog[])

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const uploadImages = async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file)
      
      if (error) throw error
      return `https://jcrlopoitculeufndpab.supabase.co/storage/v1/object/public/blog-images/${fileName}`
    })
    
    return Promise.all(uploadPromises)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let imageUrls = formData.images
      
      // Upload new images if any
      if (selectedFiles.length > 0) {
        const uploadedUrls = await uploadImages(selectedFiles)
        imageUrls = [...imageUrls, ...uploadedUrls]
      }

      const blogData = {
        ...formData,
        images: imageUrls,
        author_id: user?.id || null,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + "..."
      }

      if (editingBlog) {
        const { error } = await supabase
          .from('posts')
          .update(blogData)
          .eq('id', editingBlog.id)

        if (error) throw error
        toast({ title: "Blog actualizado exitosamente" })
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([blogData])

        if (error) throw error
        toast({ title: "Blog creado exitosamente" })
      }

      setIsDialogOpen(false)
      setEditingBlog(null)
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        images: [],
        section_id: "",
        published: false
      })
      setSelectedFiles([])
      fetchData()
    } catch (error) {
      console.error('Error saving article:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar el blog",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || "",
      images: blog.images || [],
      section_id: blog.section_id || "",
      published: blog.published
    })
    setSelectedFiles([])
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este blog?")) return

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast({ title: "Blog eliminado exitosamente" })
      fetchData()
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el blog",
        variant: "destructive",
      })
    }
  }

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ published: !currentStatus })
        .eq('id', id)

      if (error) throw error
      toast({ 
        title: !currentStatus ? "Blog publicado" : "Blog despublicado" 
      })
      fetchData()
    } catch (error) {
      console.error('Error updating blog:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el blog",
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Panel de Blogs</h1>
              <p className="text-white/90">Gestiona tus blogs deportivos</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => {
                    setEditingBlog(null)
                    setFormData({
                      title: "",
                      content: "",
                      excerpt: "",
                      images: [],
                      section_id: "",
                      published: false
                    })
                    setSelectedFiles([])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Blog
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingBlog ? "Editar Blog" : "Crear Nuevo Blog"}
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
                        placeholder="Título del blog"
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
                    <Label htmlFor="images">Imágenes</Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {selectedFiles.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {selectedFiles.length} archivo(s) seleccionado(s)
                      </div>
                    )}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {formData.images.map((url, index) => (
                          <img 
                            key={index} 
                            src={url} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Resumen</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      placeholder="Breve descripción del blog"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Contenido *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      placeholder="Escribe el contenido completo del blog aquí..."
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
                      {editingBlog ? "Actualizar" : "Crear"} Blog
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

      {/* Blogs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="hover-scale transition-smooth">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{blog.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Por: {blog.profiles?.display_name || "Autor"}</span>
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      {blog.section_id && sections.find(s => s.id === blog.section_id) && (
                        <Badge variant="outline">
                          {sections.find(s => s.id === blog.section_id)?.name}
                        </Badge>
                      )}
                      <Badge variant={blog.published ? "default" : "secondary"}>
                        {blog.published ? "Publicado" : "Borrador"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublished(blog.id, blog.published)}
                    >
                      {blog.published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(blog)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {blog.excerpt && (
                <CardContent>
                  <p className="text-muted-foreground">{blog.excerpt}</p>
                </CardContent>
              )}
            </Card>
          ))}

          {blogs.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No hay blogs</h3>
              <p className="text-muted-foreground mb-4">
                Comienza creando tu primer blog deportivo
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Blog
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
