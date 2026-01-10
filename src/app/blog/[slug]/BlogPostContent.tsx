'use client';

import { useEffect } from 'react';
import { enhanceImages } from '@/lib/client/image-enhancer';

interface BlogPostContentProps {
    content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
    useEffect(() => {
        enhanceImages();
    }, []);

    return (
        <div className="prose prose-gray max-w-none dark:prose-invert">
            <div
                dangerouslySetInnerHTML={{ __html: content }}
                suppressHydrationWarning
            />
        </div>
    );
}