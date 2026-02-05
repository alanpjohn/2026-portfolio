'use client';

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
      pagefindRef.current
        ?.search(trimmedQuery, { filter: { type: 'blog' }, limit: 12 })
        .then(async (payload) => {
          const searchResults = payload.results ?? [];
          const mappedResults = await Promise.all(
            searchResults.map(async (result: PagefindSearchResult) => {
              const data = await result.data();
              return {
                id: result.id,
                title: data.meta?.title ?? 'Untitled post',
                excerpt: data.excerpt ?? '',
                url: data.url,
              };
            }),
          );
          setResults(mappedResults);
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
    <div className="relative w-full max-w-2xl">
      <label htmlFor="blog-search" className="sr-only">
        Search blog posts
      </label>
      <div className="relative mb-3 rounded-2xl border border-foreground/10 bg-card px-4 py-3 shadow-sm transition focus-within:border-accent">
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search posts, topics, or tags"
          className="w-full bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground"
          aria-label="Search blog posts"
        />
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className="absolute left-0 right-0 z-20 overflow-hidden rounded-2xl border border-foreground/10 bg-background/80 shadow-2xl backdrop-blur"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="blog-search-dropdown"
            style={{ willChange: 'height' }}
          >
            <div className="divide-y divide-foreground/5">
              {pagefindState === 'loading' && (
                <div className="px-5 py-4 text-sm text-muted-foreground">
                  Loading search engine…
                </div>
              )}
              {pagefindState === 'error' && (
                <div className="px-5 py-4 text-sm text-destructive">
                  Search is unavailable right now.
                </div>
              )}

              {loading && (
                <div className="px-5 py-4 text-sm text-muted-foreground">
                  Searching for &ldquo;{trimmedQuery}&rdquo;…
                </div>
              )}

              {!loading && pagefindState === 'ready' && visibleResults.length === 0 && (
                <div className="px-5 py-4 text-sm text-muted-foreground">
                  No results for &ldquo;{trimmedQuery}&rdquo;.
                </div>
              )}

              {!loading && visibleResults.length > 0 && (
                <div className="flex flex-col px-2 py-2">
                  {visibleResults.map((result, index) => (
                    <motion.div
                      key={result.url}
                      className="px-4 py-3"
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Link
                        href={result.url}
                        className="block rounded-xl px-3 py-2 text-base font-semibold text-card-foreground hover:bg-accent/10"
                        onClick={() => setQuery('')}
                      >
                        <span className="block text-lg font-semibold">
                          {result.title ?? 'Untitled post'}
                        </span>
                        {result.excerpt && (
                          <span
                            className="block text-sm text-muted-foreground [&_mark]:bg-accent [&_mark]:text-accent-foreground [&_mark]:px-0.5 [&_mark]:rounded"
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
