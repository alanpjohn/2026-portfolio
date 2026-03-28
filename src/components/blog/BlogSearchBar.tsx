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

type PagefindFilterValue = string | string[] | {
  any?: string[]
  all?: string[]
  none?: string[]
}

type PagefindModule = {
  init(): Promise<void>
  search(
    query: string,
    options?: {
      filters?: Record<string, PagefindFilterValue>
      limit?: number
    },
  ): Promise<{
    results: PagefindSearchResult[]
  }>
}

interface BlogSearchBarProps {
  availableTags: string[]
}

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



interface SelectedTagsProps {
  selectedTags: string[]
  onRemove: (tag: string) => void
  onClearAll: () => void
  prefersReducedMotion: boolean | null
}

function SelectedTags({ selectedTags, onRemove, onClearAll, prefersReducedMotion }: SelectedTagsProps) {
  if (selectedTags.length === 0) return null

  const chipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.15, ease: easeOut }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.1, ease: easeIn }
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3" aria-label="Active filters">
      <button
        onClick={onClearAll}
        className="font-mono text-xs text-foreground/60 hover:text-accent underline"
        aria-label="Clear all filters"
      >
        Clear all
      </button>
      <AnimatePresence mode="popLayout">
        {selectedTags.map((tag) => (
          <motion.span
            key={tag}
            variants={chipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className="brutalist-border bg-accent/10 font-mono text-xs px-2 py-1 flex items-center gap-1"
            aria-label={`Filter: ${tag}`}
          >
            #{tag.toUpperCase()}
            <button
              onClick={() => onRemove(tag)}
              className="ml-1 text-foreground/60 hover:text-foreground"
              aria-label={`Remove ${tag} filter`}
            >
              ×
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function BlogSearchBar({ availableTags }: BlogSearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagefindState, setPagefindState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const pagefindRef = useRef<PagefindModule | null>(null);
  const loadAttemptedRef = useRef(false);

  // Screen reader announcements
  const [announcement, setAnnouncement] = useState('')

  // Announce filter changes
  useEffect(() => {
    if (selectedTags.length > 0) {
      setAnnouncement(`${selectedTags.length} filter${selectedTags.length === 1 ? '' : 's'} active: ${selectedTags.join(', ')}`)
    }
  }, [selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

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

  // Announce result count changes
  useEffect(() => {
    if (!loading && pagefindState === 'ready' && (trimmedQuery || selectedTags.length > 0)) {
      setAnnouncement(`${visibleResults.length} result${visibleResults.length === 1 ? '' : 's'} found`)
    }
  }, [visibleResults.length, loading, pagefindState, trimmedQuery, selectedTags.length])

  useEffect(() => {
    const hasQuery = trimmedQuery.length > 0;
    const hasTags = selectedTags.length > 0;

    // Early return only when BOTH query and tags are empty
    if (!hasQuery && !hasTags) {
      setResults([]);
      return;
    }

    if (pagefindState !== 'ready' || !pagefindRef.current) {
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(true);

      // Build filters object
      const filters: Record<string, PagefindFilterValue> = { type: 'blog' };
      if (hasTags) {
        filters.tag = { any: selectedTags }; // OR logic - CRITICAL!
      }

      pagefindRef.current
        ?.search(trimmedQuery, { filters, limit: 20 }) // Note: 'filters' not 'filter'
        .then(async (payload) => {
          const searchResults = payload.results ?? [];
          const mappedResults = await Promise.all(
            searchResults.map(async (result: PagefindSearchResult, index: number) => {
              const data = await result.data();

              // Calculate relevance score based on position (1.0 for first, decreasing for lower)
              const relevanceScore = 1.0 - index * 0.05;

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
  }, [trimmedQuery, selectedTags, pagefindState]); // ADD selectedTags to deps

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

  const showDropdown = trimmedQuery.length > 0 || selectedTags.length > 0;

  return (
    <div className="w-full">
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Search Input with brutalist styling */}
      <div className="brutalist-border bg-background brutalist-shadow mb-4 relative">
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
          <div className="px-4 py-3 border-l-3 border-foreground flex items-center gap-3">
            {/* Tag Toggle Button */}
            <button
              onClick={() => setIsTagDropdownOpen((prev) => !prev)}
              className={`font-mono text-xs uppercase transition-colors ${
                isTagDropdownOpen || selectedTags.length > 0
                  ? 'text-accent'
                  : 'text-foreground/50 hover:text-foreground'
              }`}
              aria-expanded={isTagDropdownOpen}
              aria-haspopup="listbox"
              aria-controls="tag-dropdown"
              aria-label={`Filter by tags${selectedTags.length > 0 ? ` (${selectedTags.length} selected)` : ''}`}
            >
              TAGS
              {selectedTags.length > 0 && (
                <span className="ml-1 text-accent" aria-hidden="true">({selectedTags.length})</span>
              )}
            </button>
            <span className="font-mono text-xs text-foreground/50 uppercase">
              SEARCH
            </span>
          </div>
        </div>
        
        {/* Tag Dropdown */}
        <AnimatePresence>
          {isTagDropdownOpen && (
            <motion.div
              id="tag-dropdown"
              role="listbox"
              aria-multiselectable="true"
              aria-label="Available tags"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="brutalist-border brutalist-shadow bg-background absolute left-0 right-0 mt-2 z-50 max-h-60 overflow-y-auto"
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault()
                  setIsTagDropdownOpen(false)
                }
              }}
            >
              <div className="p-2 flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => toggleTag(tag)}
                      className={`brutalist-border font-mono text-[10px] px-2 py-1 transition-colors text-left ${
                        isSelected
                          ? 'bg-accent text-foreground border-accent'
                          : 'hover:bg-accent/10'
                      }`}
                    >
                      #{tag.toUpperCase()}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Tags */}
      <AnimatePresence mode="popLayout">
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
          >
            <SelectedTags
              selectedTags={selectedTags}
              onRemove={removeTag}
              onClearAll={clearAllTags}
              prefersReducedMotion={prefersReducedMotion}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
                  {trimmedQuery ? (
                    selectedTags.length > 0 ? (
                      <>No results found for &quot;{trimmedQuery}&quot; with selected tags.</>
                    ) : (
                      <>No results found for &quot;{trimmedQuery}&quot;.</>
                    )
                  ) : (
                    <>No posts found with selected tags.</>
                  )}
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
