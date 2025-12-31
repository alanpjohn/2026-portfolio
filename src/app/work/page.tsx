import Link from "next/link";
import { getAllWorkProjects } from "@/lib/api/work";
import { formatDate } from "@/lib/utils/helpers";
import { CustomImage } from "@/components/ui/Image";

export const revalidate = 86400;

export default function WorkPage() {
  const projects = getAllWorkProjects();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter mb-8">
          Work & Projects
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden"
            >
              {project.image && (
                <Link href={project.liveUrl || project.githubUrl || "#"}>
                  <CustomImage
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                </Link>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl font-semibold">
                    {project.title}
                  </h2>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                      Live Demo
                    </Link>
                  )}
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      View Code
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
    </div>
  );
}