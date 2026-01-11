import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { getPaginatedBlogPosts } from "@/lib/api/blog";
import { formatDate } from "@/lib/utils/helpers";
import { seoConfig } from "@/lib/seo/config";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: seoConfig.pages.blog.title,
    description: seoConfig.pages.blog.description,
    openGraph: {
        title: seoConfig.pages.blog.title,
        description: seoConfig.pages.blog.description,
        url: '/blog',
        type: 'website',
        images: [
            {
                url: '/static/og/default.png',
                width: 1200,
                height: 630,
                alt: 'Blog - Alan John',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: seoConfig.pages.blog.title,
        description: seoConfig.pages.blog.description,
        images: ['/static/og/default.png'],
    },
};

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
    <Container className="py-12">
      <div className="">
        <h1 className="mb-8 text-4xl font-semibold tracking-tighter">Blog</h1>

        <div className="grid gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group rounded-lg border bg-card p-6 text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div className="flex flex-col space-y-2">
                  <h2 className="text-2xl font-medium leading-tight link-foreground group-hover:text-accent transition-colors duration-200">
                    {post.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <time dateTime={post.date.toISOString()}>
                      {formatDate(post.date)}
                    </time>
                  </div>
                  <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-accent px-2 py-1 text-xs text-black"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            {hasPrev && (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-black shadow border border-foreground transition-colors hover:bg-alternate"
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
                className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-black shadow border border-foreground transition-colors hover:bg-alternate"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
