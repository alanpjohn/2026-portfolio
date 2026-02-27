"use client";

import Link from "next/link";
import { BlogSearchBar } from "@/components/blog/BlogSearchBar";
import { BlogStats } from "@/components/blog/BlogStats";
import { getPaginatedBlogPosts, getAllBlogPosts } from "@/lib/api/blog";
import { formatDate } from "@/lib/utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function GetBlogStatsColSpan(
  totalPosts: number,
  featuredPostCount: number,
  gridCols: number,
) {
  const regularPostsCount = totalPosts - featuredPostCount;
  const featuredSlots = featuredPostCount * 2;
  const regularSlots = regularPostsCount;
  const totalSlots = featuredSlots + regularSlots;
  return gridCols - (totalSlots % gridCols);
}

export default function BlogPage({
  posts,
  totalPages,
  hasPrev,
  hasNext,
  currentPage,
  allPosts,
}: {
  posts: ReturnType<typeof getPaginatedBlogPosts>["posts"];
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  currentPage: number;
  allPosts: ReturnType<typeof getAllBlogPosts>;
}) {
  // Calculate grid layout for blog stats placement
  const totalPosts = posts.length;
  const featuredPostCount: number = currentPage === 1 ? 1 : 0;

  const mdBlogStatsSpan = GetBlogStatsColSpan(totalPosts, featuredPostCount, 2);
  const lgBlogStatsSpan = GetBlogStatsColSpan(totalPosts, featuredPostCount, 3);
  console.log(totalPosts, featuredPostCount, lgBlogStatsSpan, mdBlogStatsSpan);

  return (
    <main className="bg-background min-h-screen">
      {/* Header Section */}
      <section className="border-b-4 border-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-12">
            {/* Title */}
            <div className="flex flex-col gap-1 mb-8">
              <span className="font-mono text-accent font-bold text-xs uppercase tracking-[0.2em]">
                {"// JOURNAL.DB"}
              </span>
              <h1 className="font-display text-5xl md:text-6xl uppercase leading-none">
                TECHNICAL <span className="text-outline">LOGS</span>
              </h1>
            </div>

            {/* Search Bar */}
            <BlogSearchBar />
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => {
            const isFeatured = index === 0 && currentPage === 1;

            if (isFeatured) {
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="md:col-span-2 lg:col-span-2 group"
                >
                  <article className="brutalist-border bg-background brutalist-shadow group-hover:shadow-[6px_6px_0px_0px_var(--accent)] transition-all h-full flex flex-col md:flex-row overflow-hidden">
                    {/*<div className="md:w-2/5 border-b-3 md:border-b-0 md:border-r-3 border-foreground h-48 md:h-auto bg-accent/10 flex items-center justify-center">
                      <div className="font-mono text-xs text-foreground/50 uppercase">
                        [ NO_IMAGE ]
                      </div>
                    </div>*/}

                    <div className="p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-mono bg-accent text-foreground px-2 py-0.5 text-xs font-bold uppercase">
                            LATEST_LOG
                          </span>
                          <span className="font-mono text-foreground/50 text-sm">
                            {formatDate(post.date)}
                          </span>
                        </div>
                        <h2 className="font-display text-2xl md:text-3xl uppercase mb-4 leading-tight group-hover:text-accent transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-foreground/70 mb-6 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {post.tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="font-mono text-xs border-2 border-foreground px-2 py-0.5"
                            >
                              #{t.toUpperCase()}
                            </span>
                          ))}
                        </div>
                        <span className="font-display font-bold text-lg uppercase flex items-center gap-2 group-hover:text-accent transition-colors">
                          READ{" "}
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            }

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="brutalist-border bg-background brutalist-shadow group-hover:shadow-[6px_6px_0px_0px_var(--accent)] transition-all h-full flex flex-col p-6">
                  <div className="flex justify-between mb-6 font-mono text-sm">
                    <span className="text-foreground/50">
                      #
                      {String(
                        allPosts.length - ((currentPage - 1) * 6 + index),
                      ).padStart(3, "0")}
                    </span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <h2 className="font-display text-xl uppercase mb-4 flex-grow group-hover:text-accent transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-foreground/60 mb-6 text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="pt-4 border-t-3 border-foreground flex justify-between items-center">
                    <span className="font-mono font-bold uppercase text-xs">
                      {post.tags.join(" ") || "TECH"}
                    </span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-xl group-hover:rotate-45 transition-transform"
                    />
                  </div>
                </article>
              </Link>
            );
          })}

          {/* Blog Stats Card */}
          <div
            className={`lg:col-span-${lgBlogStatsSpan} md:col-span-${mdBlogStatsSpan}`}
          >
            <div className="flex flex-col brutalist-border bg-background brutalist-shadow p-6 h-full overflow-hidden">
              <div className="shrink w-full">
                <h3 className="font-mono text-xs uppercase text-foreground/50 mb-3 font-bold tracking-[0.2em]">
                  {"// STATS"}
                </h3>
                <BlogStats posts={allPosts} />
              </div>

              {/* Coming Soon Info */}
              <div className="mt-6 pt-6 border-t-2 border-foreground/20">
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-accent font-bold">→</span>
                    <p className="text-foreground/70">
                      <span className="font-bold text-foreground">
                        More articles in the pipeline.
                      </span>{" "}
                      Currently drafting deep dives on distributed systems, AI
                      architecture, and cloud-native patterns.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-accent font-bold">→</span>
                    <p className="text-foreground/70">
                      <span className="font-bold text-foreground">
                        Publishing cadence:
                      </span>{" "}
                      Trying to push out at least one article a month. Quality
                      over quantity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between border-t-4 border-foreground pt-8 gap-6">
            {/* Prev/Next Buttons */}
            <div className="flex gap-2">
              {hasPrev ? (
                <Link
                  href={`/blog?page=${currentPage - 1}`}
                  className="brutalist-border px-4 py-2 font-mono font-bold text-sm hover:bg-accent transition-colors bg-background brutalist-shadow-sm"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  PREV
                </Link>
              ) : (
                <button
                  disabled
                  className="brutalist-border px-4 py-2 font-mono font-bold text-sm opacity-50 cursor-not-allowed bg-background"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  PREV
                </button>
              )}
              {hasNext ? (
                <Link
                  href={`/blog?page=${currentPage + 1}`}
                  className="brutalist-border px-4 py-2 font-mono font-bold text-sm hover:bg-accent transition-colors bg-background brutalist-shadow-sm"
                >
                  NEXT
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Link>
              ) : (
                <button
                  disabled
                  className="brutalist-border px-4 py-2 font-mono font-bold text-sm opacity-50 cursor-not-allowed bg-background"
                >
                  NEXT
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </button>
              )}
            </div>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                return (
                  <Link
                    key={pageNum}
                    href={`/blog?page=${pageNum}`}
                    className={`brutalist-border w-10 h-10 flex items-center justify-center font-bold text-sm transition-colors ${
                      isActive
                        ? "bg-foreground text-background"
                        : "hover:bg-accent bg-background"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="w-10 h-10 flex items-end justify-center font-bold text-xl">
                    ...
                  </span>
                  <Link
                    href={`/blog?page=${totalPages}`}
                    className="brutalist-border w-10 h-10 flex items-center justify-center font-bold text-sm hover:bg-accent transition-colors bg-background"
                  >
                    {totalPages}
                  </Link>
                </>
              )}
            </div>

            {/* Page info */}
            <div className="font-mono text-foreground/50 text-sm">
              {"CACHE_PAGE: "}
              {String(currentPage).padStart(2, "0")}
              {" // "}
              {String(totalPages).padStart(2, "0")}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
