import { blog, work } from "velite-content";
import type { BlogPost } from "@/types/blog";
import type { WorkItem } from "@/types/work";
import { env } from "node:process";

// Content interfaces for future CMS integration
export interface ContentAPI {
    getBlogPosts(): BlogPost[];
    getBlogPostBySlug(slug: string): BlogPost | undefined;
    getWorkItems(): WorkItem[];
    getWorkProjects(): WorkItem[];
    getWorkExperiences(): WorkItem[];
    getFeaturedWorkItems(): WorkItem[];
}

// Velite-based content engine implementation
class VeliteContentAPI implements ContentAPI {
    getBlogPosts(): BlogPost[] {
        return (blog as unknown as BlogPost[])
            .map((post: BlogPost) => ({
                ...post,
                date: new Date(post.date as string | Date),
            }))
            .sort(
                (a: BlogPost, b: BlogPost) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
            ).filter((post: BlogPost) => post.publish || env.NODE_ENV != "production" || env.INCLUDE_ALL === "true");
    }

    getBlogPostBySlug(slug: string): BlogPost | undefined {
        const post = (blog as unknown as BlogPost[]).find(
            (p: BlogPost) => p.slug === slug,
        );
        if (!post) return undefined;
        return {
            ...post,
            date: new Date(post.date as string | Date),
        };
    }

    getWorkItems(): WorkItem[] {
        const workData = work as unknown as { items: WorkItem[] }[];
        const items = workData[0]?.items || [];
        return items
            .map((item: WorkItem) => ({
                ...item,
                date: new Date(item.date as string | Date),
                endDate: item.endDate ? new Date(item.endDate as string | Date) : null,
            }))
            .sort((a: WorkItem, b: WorkItem) => {
                // Sort by type first: experiences before projects
                if (a.type !== b.type) {
                    return a.type === "experience" ? -1 : 1;
                }
                // Within same type, sort by date (newest first)
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
    }

    getWorkProjects(): WorkItem[] {
        return this.getWorkItems().filter((item) => item.type === "project");
    }

    getWorkExperiences(): WorkItem[] {
        return this.getWorkItems().filter((item) => item.type === "experience");
    }

    getFeaturedWorkItems(): WorkItem[] {
        return this.getWorkItems().filter((item) => item.featured);
    }
}

// Export singleton instance
export const contentAPI: ContentAPI = new VeliteContentAPI();

// Helper functions for pagination
export function paginateItems<T>(
    items: T[],
    page: number,
    itemsPerPage: number,
): {
    items: T[];
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
} {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
        items: paginatedItems,
        totalPages,
        totalItems,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
}
