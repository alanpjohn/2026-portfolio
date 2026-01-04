import Link from "next/link";
import { getPaginatedBlogPosts } from "@/lib/api/blog";
import { formatDate } from "@/lib/utils/helpers";

export const revalidate = 86400;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const { posts, totalPages, hasPrev, hasNext } =
    getPaginatedBlogPosts(currentPage);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter mb-8">Blog</h1>

        <div className="grid gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
            >
              <div className="flex flex-col space-y-2">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-semibold leading-tight hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <time dateTime={post.date.toISOString()}>
                    {formatDate(post.date)}
                  </time>
                </div>
                <p className="text-muted-foreground mt-2">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            {hasPrev && (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Previous
              </Link>
            )}
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            {hasNext && (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
