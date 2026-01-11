import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/api/blog";
import { formatDate } from "@/lib/utils/helpers";
import { BlogPostContent } from "./BlogPostContent";
import type { Metadata } from "next";

export async function generateStaticParams() {
    const posts = getAllBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} - Alan John Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date.toISOString(),
            url: `/blog/${slug}`,
            images: [
                {
                    url: `/static/og/${slug}.png`,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [`/static/og/${slug}.png`],
        },
    };
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
                        className="mb-8 inline-flex items-center text-sm link-foreground hover:text-accent transition-colors duration-200"
                    >
                        ← Back to Blog
                    </Link>

                    <div className="mb-8 space-y-4">
                        <h1 className="text-4xl font-medium tracking-tighter">
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
                                    className="rounded-md bg-accent px-2 py-1 text-xs text-black"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <BlogPostContent content={post.content} />
                </div>
            </Container>
        </article>
    );
}
