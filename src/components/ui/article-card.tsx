import { Link } from "react-router-dom"
import { Calendar, User, Eye, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HeroButton } from "@/components/ui/hero-button"

interface ArticleCardProps {
  id: string
  title: string
  excerpt?: string
  imageUrl?: string
  authorName?: string
  publishedAt: string
  category?: string
  isPublished?: boolean
  className?: string
}

export const ArticleCard = ({
  id,
  title,
  excerpt,
  imageUrl,
  authorName,
  publishedAt,
  category,
  isPublished = true,
  className,
}: ArticleCardProps) => {
  const formattedDate = new Date(publishedAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card className={`group overflow-hidden transition-smooth hover:shadow-lg hover:scale-[1.02] ${className}`}>
      {imageUrl && (
        <div className="relative overflow-hidden aspect-video">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-smooth" />
          {category && (
            <div className="absolute top-4 left-4">
              <Badge className="sports-gradient text-primary-foreground">
                {category}
              </Badge>
            </div>
          )}
          {!isPublished && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary">
                Borrador
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-smooth">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="pb-4">
        {excerpt && (
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            {authorName && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{authorName}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link to={`/articles/${id}`} className="w-full">
          <HeroButton variant="hero-outline" className="w-full group/btn">
            Leer Más
            <ArrowRight className="h-4 w-4 transition-smooth group-hover/btn:translate-x-1" />
          </HeroButton>
        </Link>
      </CardFooter>
    </Card>
  )
}