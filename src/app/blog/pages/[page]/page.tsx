import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import BlogPageClient from "../../../../components/blog/BlogPageClient";
import { getPaginatedBlogPosts, getAllBlogPosts, getAllTags } from "@/lib/api/blog";
import { siteConfig } from "@/data/config";

type PageParams = { page: string };

export async function generateStaticParams() {
  const allPosts = getAllBlogPosts();
  const totalPages = Math.ceil(
    allPosts.length / siteConfig.pagination.postsPerPage
  );

  // Always generate at least page 2 to satisfy static export
  // If there's only 1 page, page 2 will redirect to /blog
  const pagesToGenerate = Math.max(1, totalPages - 1);
  
  return Array.from({ length: pagesToGenerate }, (_, i) => ({
    page: String(i + 2), // Pages 2, 3, 4, etc.
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { page } = await params;
  const currentPage = Number(page);

  return {
    title: `Blog - Page ${currentPage}`,
    description: `Page ${currentPage} of technical articles and insights`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { page } = await params;
  const currentPage = Number(page);

  // Validate page number
  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  // Redirect page 1 to main blog page
  if (currentPage === 1) {
    redirect("/blog");
  }

  const { posts, totalPages, hasPrev, hasNext } =
    getPaginatedBlogPosts(currentPage);

  // If there aren't enough posts for this page, redirect to main blog
  if (currentPage > totalPages) {
    redirect("/blog");
  }

  const allPosts = getAllBlogPosts();
  const allTags = getAllTags().sort((a, b) => a.localeCompare(b));

  return (
    <BlogPageClient
      posts={posts}
      totalPages={totalPages}
      hasPrev={hasPrev}
      hasNext={hasNext}
      currentPage={currentPage}
      allPosts={allPosts}
      availableTags={allTags}
      isLastPage={!hasNext}
    />
  );
}
