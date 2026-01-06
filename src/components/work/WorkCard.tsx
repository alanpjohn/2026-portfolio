import Link from "next/link"
import { formatDate } from '@/lib/utils/helpers'
import { CustomImage } from '@/components/ui/Image'
import type { WorkItem } from '@/types/work'

interface WorkCardProps {
  item: WorkItem
}

export function WorkCard({ item }: WorkCardProps) {
  return (
    <div className="space-y-8">
      {item.image && (
        <div className="flex justify-center">
          {item.type === 'project' && item.url ? (
            <Link href={item.url} target="_blank" rel="noopener noreferrer">
              <CustomImage
                src={item.image}
                alt={item.title}
                width={600}
                height={400}
                className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </Link>
          ) : (
            <CustomImage
              src={item.image}
              alt={item.title}
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          )}
        </div>
      )}

      <div className="text-center">
        <div className="inline-block pb-2 border-b-2 border-primary mb-6">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {item.type}
          </span>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">{item.title}</h3>
        {item.type === 'experience' && item.company && (
          <p className="text-lg text-muted-foreground">{item.role} at {item.company}</p>
        )}
        <p className="text-muted-foreground max-w-2xl mx-auto">{item.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {item.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground">
            {tag}
          </span>
        ))}
      </div>

      {item.type === 'project' && item.url && (
        <div className="text-center">
          <a href={item.url} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            View Project
          </a>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        <time dateTime={item.date.toISOString()}>
          {item.type === 'experience'
            ? `${formatDate(item.date)} - ${item.endDate ? formatDate(item.endDate) : 'Present'}`
            : formatDate(item.date)
          }
        </time>
      </div>
    </div>
  )
}