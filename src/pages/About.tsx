import { Users, Target, Trophy, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Estrategia",
      description: "Analizamos cada jugada, cada decisión y cada momento del deporte con precision táctica."
    },
    {
      icon: Trophy,
      title: "Excelencia",
      description: "Buscamos la calidad en cada contenido, ofreciendo análisis profundos y únicos."
    },
    {
      icon: Heart,
      title: "Pasión",
      description: "El deporte corre por nuestras venas. Es nuestra pasión compartir esa emoción contigo."
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Construimos una comunidad de aficionados que comparten la misma pasión por el deporte."
    }
  ]

  const team = [
    {
      name: "Carlos Rodríguez",
      role: "Director Deportivo",
      description: "Ex-entrenador profesional con 15 años de experiencia en análisis táctico."
    },
    {
      name: "María González",
      role: "Editora Jefe",
      description: "Periodista deportiva especializada en fútbol internacional y estrategias de juego."
    },
    {
      name: "Diego Martínez",
      role: "Analista Táctico",
      description: "Especialista en estadísticas deportivas y análisis de rendimiento."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-primary-glow">Nosotros Somos Estrategas</span>
          </h1>
          <p className="text-xl md:text-2xl text-black/90 max-w-3xl mx-auto leading-relaxed">
            Donde la pasión por el deporte se encuentra con el análisis profundo. 
            Creamos contenido que va más allá del resultado final.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 sports-gradient bg-clip-text text-transparent">
              Nuestra Misión
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              En Estrategas, creemos que cada partido cuenta una historia más profunda. 
              Nuestro objetivo es descifrar las tácticas, analizar las estrategias y 
              compartir la pasión que hace del deporte algo extraordinario.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover-scale transition-smooth elegant-shadow">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 sports-gradient bg-clip-text text-transparent">
              Nuestra Historia
            </h2>
          </div>
          
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="text-lg leading-relaxed mb-6">
              Estrategas nació de la frustración de no encontrar análisis deportivos que fueran 
              más allá de los números básicos. En 2020, un grupo de analistas deportivos, 
              ex-entrenadores y periodistas se unieron con una visión clara: crear contenido 
              que realmente explicara el "por qué" detrás de cada jugada.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Desde entonces, hemos crecido hasta convertirnos en una plataforma de referencia 
              para aficionados que buscan entender el deporte desde una perspectiva más profunda. 
              Nuestros análisis tácticos, reportajes especiales y cobertura de eventos han 
              ayudado a miles de seguidores a ver el deporte con nuevos ojos.
            </p>

            <p className="text-lg leading-relaxed">
              Hoy, seguimos comprometidos con nuestra misión original: hacer que cada aficionado 
              pueda apreciar la belleza estratégica del deporte que ama.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 sports-gradient bg-clip-text text-transparent">
              Nuestro Equipo
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conoce a los estrategas detrás del contenido que te apasiona.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="hover-scale transition-smooth elegant-shadow">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About