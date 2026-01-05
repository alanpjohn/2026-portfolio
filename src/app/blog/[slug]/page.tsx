import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/api/blog";
import { formatDate } from "@/lib/utils/helpers";

export const revalidate = 86400;

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <Container className="py-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            ← Back to Blog
          </Link>

          <div className="mb-8 space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={post.date.toISOString()}>
                {formatDate(post.date)}
              </time>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="prose prose-gray max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </Container>
    </article>
  );
}
