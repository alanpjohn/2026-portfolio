'use client';

// TODO: Add tag-based filtering after more blog posts are added
// Tags are already indexed in pagefind via data-pagefind-filter attributes
// Current implementation only uses text search until blog grows larger

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  easeIn,
  easeOut,
  useReducedMotion,
} from 'framer-motion';

type PagefindResult = {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: Date;
  score: number;
};

type PagefindSearchResult = {
  id: string;
  data(): Promise<{
    meta?: { title?: string };
    excerpt?: string;
    url: string;
  }>;
};

type PagefindModule = {
  init(): Promise<void>;
  search(
    query: string,
    options?: { filter?: Record<string, string | string[]>; limit?: number },
  ): Promise<{
    results: PagefindSearchResult[];
  }>;
};

const RESULT_LIMIT = 6;
const RECENCY_DECAY_DAYS = 30;
const RELEVANCE_WEIGHT = 0.7;
const RECENCY_WEIGHT = 0.3;

function calculateRecencyScore(date: Date): number {
  const daysAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  return Math.exp(-daysAgo / RECENCY_DECAY_DAYS);
}

function calculateHybridScore(relevanceScore: number, date: Date): number {
  const recencyScore = calculateRecencyScore(date);
  return (relevanceScore * RELEVANCE_WEIGHT) + (recencyScore * RECENCY_WEIGHT);
}

function extractDateFromUrl(url: string): Date | null {
  const match = url.match(/\/blog\/([\w-]+)/);
  if (!match) return null;
  
  const slug = match[1];
  const dateMatch = slug.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    return new Date(`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`);
  }
  
  return null;
}

export function BlogSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagefindState, setPagefindState] = useState<'loading' | 'ready' | 'error'>('loading');
  const prefersReducedMotion = useReducedMotion();
  const pagefindRef = useRef<PagefindModule | null>(null);
  const loadAttemptedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (loadAttemptedRef.current) return;
    loadAttemptedRef.current = true;

    const loadPagefind = async () => {
      try {
        // Dynamic import with webpackIgnore to prevent bundling at build time
        // Pagefind files are generated post-build, so this must be runtime-only
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - Pagefind is loaded at runtime from /pagefind/ directory
        const pagefind = (await import(
          /* webpackIgnore: true */
          '/pagefind/pagefind.js'
        )) as PagefindModule;
        await pagefind.init();
        pagefindRef.current = pagefind;
        setPagefindState('ready');
      } catch {
        setPagefindState('error');
      }
    };

    loadPagefind();
  }, []);

  const trimmedQuery = query.trim();
  const visibleResults = useMemo(() => results.slice(0, RESULT_LIMIT), [results]);

  useEffect(() => {
    if (!trimmedQuery) {
      setResults([]);
      return;
    }

    if (pagefindState !== 'ready' || !pagefindRef.current) {
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(true);
      
      // TODO: Add tag filtering here after more blog posts are added
      // filter: { type: 'blog', tag: selectedTags }
      
      pagefindRef.current
        ?.search(trimmedQuery, { filter: { type: 'blog' }, limit: 20 })
        .then(async (payload) => {
          const searchResults = payload.results ?? [];
          const mappedResults = await Promise.all(
            searchResults.map(async (result: PagefindSearchResult, index: number) => {
              const data = await result.data();
              
              // Calculate relevance score based on position (1.0 for first, decreasing for lower)
              const relevanceScore = 1.0 - (index * 0.05);
              
              // Try to extract date from URL or meta
              let postDate = extractDateFromUrl(data.url);
              if (!postDate) {
                // Fallback: assume recent post if date can't be extracted
                postDate = new Date();
              }
              
              const hybridScore = calculateHybridScore(relevanceScore, postDate);
              
              return {
                id: result.id,
                title: data.meta?.title ?? 'Untitled post',
                excerpt: data.excerpt ?? '',
                url: data.url,
                date: postDate,
                score: hybridScore,
              };
            }),
          );
          
          // Sort by hybrid score (higher is better)
          const sortedResults = mappedResults.sort((a, b) => b.score - a.score);
          setResults(sortedResults);
        })
        .catch(() => {
          setResults([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 250);

    return () => clearTimeout(timeout);
  }, [trimmedQuery, pagefindState]);

  const containerVariants = {
    hidden: {
      opacity: 0,
      height: 0,
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            opacity: { duration: 0.25, ease: easeOut },
            height: { duration: 0.3, ease: easeOut },
          },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { opacity: { duration: 0.15, ease: easeIn }, height: { duration: 0.2, ease: easeIn } },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -8,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            delay: 0.15 + index * 0.05,
            duration: 0.2,
            ease: easeOut,
          },
    }),
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -6,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.2, ease: easeIn },
    },
  };

  const showDropdown = trimmedQuery.length > 0;

  return (
    <div className="w-full">
      {/* Search Input with brutalist styling */}
      <div className="brutalist-border bg-background brutalist-shadow mb-4">
        <label htmlFor="blog-search" className="sr-only">
          Search blog posts
        </label>
        <div className="flex items-center">
          <div className="flex-grow flex items-center px-4 py-3">
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search posts, topics, or tags..."
              className="w-full bg-transparent text-base font-medium outline-none placeholder:text-foreground/50 font-mono"
              aria-label="Search blog posts"
            />
          </div>
          <div className="px-4 py-3 border-l-3 border-foreground">
            <span className="font-mono text-xs text-foreground/50 uppercase">
              SEARCH
            </span>
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className="brutalist-border bg-background brutalist-shadow overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="blog-search-dropdown"
          >
            <div className="p-4">
              {pagefindState === 'loading' && (
                <div className="px-4 py-3 text-sm font-mono text-foreground/60">
                  Loading search engine...
                </div>
              )}
              {pagefindState === 'error' && (
                <div className="px-4 py-3 text-sm font-mono text-red-500">
                  Search is unavailable right now.
                </div>
              )}

              {loading && (
                <div className="px-4 py-3 text-sm font-mono text-foreground/60">
                  Searching...
                </div>
              )}

              {!loading && pagefindState === 'ready' && visibleResults.length === 0 && (
                <div className="px-4 py-3 text-sm font-mono text-foreground/60">
                  No results found.
                </div>
              )}

              {!loading && visibleResults.length > 0 && (
                <div className="flex flex-col">
                  {visibleResults.map((result, index) => (
                    <motion.div
                      key={result.url}
                      className="border-b-2 border-foreground/10 last:border-b-0"
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Link
                        href={result.url}
                        className="block px-4 py-3 hover:bg-accent/10 transition-colors"
                        onClick={() => setQuery('')}
                      >
                        <span className="block text-lg font-semibold font-display uppercase mb-1">
                          {result.title ?? 'Untitled post'}
                        </span>
                        {result.excerpt && (
                          <span
                            className="block text-sm text-foreground/70 [&_mark]:bg-accent [&_mark]:text-foreground [&_mark]:px-0.5"
                            dangerouslySetInnerHTML={{ __html: result.excerpt }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
