'use client';

import { useEffect } from 'react';
import { enhanceImages } from '@/lib/client/image-enhancer';

interface BlogPostContentProps {
    content: string;
    tags: string[];
    date: Date;
}

export function BlogPostContent({ content, tags, date }: BlogPostContentProps) {
    useEffect(() => {
        enhanceImages();
    }, []);

    const dateString = date.toISOString().split('T')[0];

    return (
        <div 
            data-pagefind-body 
            data-pagefind-filter="type:blog"
            data-pagefind-sort={`date:${dateString}`}
            className="prose prose-gray max-w-none dark:prose-invert"
        >
            {/* Separate span elements for each tag filter - Pagefind requires individual attributes */}
            {tags.map((tag) => (
                <span
                    key={tag}
                    data-pagefind-filter={`tag:${tag}`}
                    style={{ display: 'none' }}
                />
            ))}
            <div
                dangerouslySetInnerHTML={{ __html: content }}
                suppressHydrationWarning
            />
        </div>
    );
}
