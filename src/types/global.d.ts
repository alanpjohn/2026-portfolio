// Global type declarations for external runtime modules
// These modules are loaded dynamically at runtime, not bundled

declare module '*pagefind.js' {
  interface PagefindSearchResult {
    id: string;
    data(): Promise<{
      meta?: { title?: string };
      excerpt?: string;
      url: string;
    }>;
  }

  interface PagefindSearchResponse {
    results: PagefindSearchResult[];
  }

  interface PagefindModule {
    init(): Promise<void>;
    search(
      query: string,
      options?: { filter?: Record<string, string | string[]>; limit?: number },
    ): Promise<PagefindSearchResponse>;
  }

  const pagefind: PagefindModule;
  export default pagefind;
}
