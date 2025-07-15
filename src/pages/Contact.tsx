import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "contacto@estrategas.com",
      description: "Responderemos en 24-48 horas"
    },
    {
      icon: Phone,
      title: "Teléfono",
      content: "+1 (555) 123-4567",
      description: "Lun - Vie, 9:00 AM - 6:00 PM"
    },
    {
      icon: MapPin,
      title: "Oficina",
      content: "Madrid, España",
      description: "Centro de operaciones principal"
    },
    {
      icon: Clock,
      title: "Horario",
      content: "24/7 Online",
      description: "Contenido disponible siempre"
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      })
      setFormData({ name: "", email: "", subject: "", message: "" })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-primary-glow">Conecta</span> con Nosotros
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            ¿Tienes una historia que contar? ¿Una pregunta sobre estrategias? 
            Estamos aquí para escucharte.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="elegant-shadow">
              <CardHeader>
                <CardTitle className="text-2xl sports-gradient bg-clip-text text-transparent flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Envíanos un Mensaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="¿De qué quieres hablarnos?"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos tu idea, pregunta o comentario..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-primary hover:bg-gradient-primary/90 transition-smooth"
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 sports-gradient bg-clip-text text-transparent">
                Información de Contacto
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Estamos aquí para ayudarte. Ya sea que tengas preguntas sobre nuestros 
                análisis, quieras proponer una colaboración, o simplemente quieras 
                charlar sobre deporte, no dudes en contactarnos.
              </p>
            </div>

            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover-scale transition-smooth elegant-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-gradient-primary rounded-lg">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {info.title}
                      </h3>
                      <p className="text-primary font-medium mb-1">
                        {info.content}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {info.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Info */}
            <Card className="bg-gradient-primary text-white elegant-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  ¿Eres creador de contenido deportivo?
                </h3>
                <p className="text-white/90 mb-4">
                  Si eres un analista, ex-jugador, entrenador o simplemente un 
                  apasionado del deporte con ideas únicas, nos encantaría colaborar contigo.
                </p>
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Únete al Equipo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact