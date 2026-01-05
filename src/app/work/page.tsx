import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { getAllWorkProjects } from "@/lib/api/work";
import { formatDate } from "@/lib/utils/helpers";
import { CustomImage } from "@/components/ui/Image";

export const revalidate = 86400;

export default function WorkPage() {
  const projects = getAllWorkProjects();

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tighter">
          Work & Projects
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              {project.image && (
                <Link href={project.url || "#"}>
                  <CustomImage
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={400}
                    className="h-48 w-full object-cover"
                  />
                </Link>
              )}
              <div className="p-6">
                <div className="mb-2 flex items-start justify-between">
                  <h2 className="text-2xl font-semibold">
                    {project.title}
                  </h2>
                  {project.featured && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mb-4 text-muted-foreground">
                  {project.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  {project.url && (
                    <Link
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                      View Project
                    </Link>
                  )}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <time dateTime={project.date.toISOString()}>
                    {formatDate(project.date)}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Container>
  );
}
