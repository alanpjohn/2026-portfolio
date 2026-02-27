import BlogPageClient from "../../components/blog/BlogPageClient";
import { getPaginatedBlogPosts, getAllBlogPosts } from "@/lib/api/blog";
import { seoConfig } from "@/lib/seo/config";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: seoConfig.pages.blog.title,
  description: seoConfig.pages.blog.description,
  openGraph: {
    title: seoConfig.pages.blog.title,
    description: seoConfig.pages.blog.description,
    url: "/blog",
    type: "website",
    images: [
      {
        url: "/static/og/default.png",
        width: 1200,
        height: 630,
        alt: "Blog - Alan John",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.pages.blog.title,
    description: seoConfig.pages.blog.description,
    images: ["/static/og/default.png"],
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
  const allPosts = getAllBlogPosts();

  return (
    <BlogPageClient
      posts={posts}
      totalPages={totalPages}
      hasPrev={hasPrev}
      hasNext={hasNext}
      currentPage={currentPage}
      allPosts={allPosts}
    />
  );
}
