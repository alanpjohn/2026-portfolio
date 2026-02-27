import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/api/blog";
import { formatDate } from "@/lib/utils/helpers";
import { BlogPostContent } from "../../../components/blog/BlogPostContent";
import { socialLinks } from "@/data/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
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
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} - Alan John Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date.toISOString(),
      url: `/blog/${slug}`,
      images: [
        {
          url: `/static/og/${slug}.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`/static/og/${slug}.png`],
    },
  };
}

// Extract headings from HTML content for TOC
function extractHeadings(content: string) {
  const headings: { level: number; text: string; id: string }[] = [];
  const regex = /<h([1234])[^>]*>(.*?)<\/h\1>/gi;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1], 10);
    // Strip HTML tags from text
    const text = match[2].replace(/<[^>]+>/g, "");
    // Create ID from text (slugify)
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    headings.push({ level, text, id });
  }

  return headings;
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

  // Get prev/next posts
  const allPosts = getAllBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // Extract headings for TOC
  const headings = extractHeadings(post.content);

  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Sidebar - TOC */}
          <aside className="hidden lg:block lg:col-span-3 border-r-4 border-foreground p-6 space-y-10 sticky top-16 h-fit">
            {/* Back to blog link */}
            <div>
              <Link
                href="/blog"
                className="flex items-center gap-2 font-mono text-sm font-bold uppercase link-foreground hover:text-accent transition-colors mb-6"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back to Logs
              </Link>
            </div>

            {/* Table of Contents */}
            {headings.length > 0 && (
              <section>
                <h3 className="font-mono text-[10px] uppercase text-foreground/50 mb-4 font-bold tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent"></span>
                  TABLE_OF_CONTENTS
                </h3>
                <ul className="space-y-2 font-display text-sm font-bold uppercase">
                  {headings.map((heading, index) => (
                    <li
                      key={index}
                      className={heading.level === 3 ? "pl-4" : ""}
                    >
                      <a
                        href={`#${heading.id}`}
                        className="flex items-center gap-2 hover:text-accent transition-colors"
                      >
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="text-xs"
                        />
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Categories */}
            <section>
              <h3 className="font-mono text-[10px] uppercase text-foreground/50 mb-4 font-bold tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 bg-accent"></span>
                CATEGORIES
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 border-2 border-foreground font-mono text-xs font-bold uppercase bg-accent text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-9 p-6 md:p-10 lg:p-12">
            {/* Mobile back link */}
            <div className="lg:hidden mb-6">
              <Link
                href="/blog"
                className="flex items-center gap-2 font-mono text-sm font-bold uppercase link-foreground hover:text-accent transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back to Logs
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-10 border-b-4 border-foreground pb-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <time className="font-mono text-xs bg-accent text-foreground px-2 py-0.5 font-bold tracking-tighter uppercase">
                  {formatDate(post.date)}
                </time>
                <span className="font-mono text-xs text-foreground/50 uppercase tracking-widest">
                  {"// 8 MIN READ"}
                </span>
                <span className="font-mono text-xs text-accent uppercase font-bold tracking-widest">
                  {"// TECHNICAL"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display uppercase leading-[0.95] mb-4">
                {post.title}
              </h1>
              <p className="text-lg font-medium leading-snug max-w-2xl text-foreground/70 italic border-l-4 border-accent pl-4">
                {post.excerpt}
              </p>
            </header>

            {/* Article Body */}
            <BlogPostContent
              content={post.content}
              tags={post.tags}
              date={post.date}
            />

            {/* Author Bio */}
            <footer className="mt-16 pt-8 border-t-4 border-foreground">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 bg-accent shrink-0 border-4 border-foreground flex items-center justify-center overflow-hidden">
                  <span className="font-display text-4xl font-bold text-foreground">
                    AJ
                  </span>
                </div>
                <div className="grow text-center md:text-left">
                  <h4 className="font-display font-bold text-xl uppercase mb-1">
                    Alan John
                  </h4>
                  <p className="text-sm mb-4 max-w-xl text-foreground/70">
                    Software Engineer specializing in backend systems and cloud
                    infrastructure. Currently focused on distributed systems and
                    AI applications.
                  </p>
                  <div className="flex justify-center md:justify-start gap-4">
                    <a
                      href={socialLinks[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs font-bold border-b-2 border-foreground hover:text-accent hover:border-accent transition-all uppercase"
                    >
                      <FontAwesomeIcon icon={faGithub} className="mr-1" />
                      GitHub
                    </a>
                    <a
                      href={socialLinks[1].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs font-bold border-b-2 border-foreground hover:text-accent hover:border-accent transition-all uppercase"
                    >
                      <FontAwesomeIcon icon={faLinkedin} className="mr-1" />
                      LinkedIn
                    </a>
                    <a
                      href={`https://x.com/intent/tweet?text=Check out this article:${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://alanjohn.dev/blog/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs font-bold border-b-2 border-foreground hover:text-accent hover:border-accent transition-all uppercase"
                    >
                      <FontAwesomeIcon icon={faXTwitter} className="mr-1" />
                      Share
                    </a>
                  </div>
                </div>
              </div>
            </footer>

            {/* Previous/Next Navigation */}
            <section className="mt-16">
              <h3 className="font-display font-bold text-xl uppercase mb-6 tracking-tight flex items-center gap-4">
                Continue Reading
                <span className="h-0.5 grow bg-foreground opacity-20"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevPost && (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group p-4 border-4 border-foreground bg-background hover:bg-accent transition-colors"
                  >
                    <span className="font-mono text-xs uppercase mb-1 block text-foreground/50 group-hover:text-foreground transition-colors">
                      {"<< Previous"}
                    </span>
                    <h4 className="font-display font-bold text-lg uppercase leading-tight group-hover:underline">
                      {prevPost.title}
                    </h4>
                  </Link>
                )}
                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group p-4 border-4 border-foreground bg-background hover:bg-accent transition-colors md:col-start-2"
                  >
                    <span className="font-mono text-xs uppercase mb-1 block text-foreground/50 group-hover:text-foreground transition-colors text-right">
                      {"Next >>"}
                    </span>
                    <h4 className="font-display font-bold text-lg uppercase leading-tight group-hover:underline text-right">
                      {nextPost.title}
                    </h4>
                  </Link>
                )}
              </div>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
