import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ]

  const quickLinks = [
    { name: "Inicio", href: "/" },
    { name: "Artículos", href: "/articles" },
    { name: "Categorías", href: "/categories" },
    { name: "Nosotros", href: "/about" },
    { name: "Contacto", href: "/contact" },
  ]

  const contactInfo = [
    { icon: Mail, text: "info@estrategas.com" },
    { icon: Phone, text: "+1 (555) 123-4567" },
    { icon: MapPin, text: "Ciudad, País" },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/019e4c4d-0e97-4cc1-aceb-e59ef13e31ee.png" 
                alt="Estrategas" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold sports-gradient bg-clip-text text-transparent">
                Estrategas
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Tu fuente confiable de análisis deportivos, estrategias y contenido exclusivo. 
              Manténte al día con las últimas noticias y análisis del mundo deportivo.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-smooth p-2 hover:bg-primary/10 rounded-md"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              {contactInfo.map((contact, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <contact.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{contact.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Estrategas. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-muted-foreground hover:text-primary text-sm transition-smooth"
              >
                Política de Privacidad
              </Link>
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-primary text-sm transition-smooth"
              >
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}