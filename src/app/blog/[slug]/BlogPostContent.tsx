'use client';

import { useEffect, useRef } from 'react';
import { enhanceImages } from '@/lib/client/image-enhancer';

interface BlogPostContentProps {
    content: string;
    tags: string[];
    date: Date;
}

export function BlogPostContent({ content, tags, date }: BlogPostContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        enhanceImages();
    }, []);

    useEffect(() => {
        if (!contentRef.current) return;

        const tables = contentRef.current.querySelectorAll('table');
        
        tables.forEach((table) => {
            if (table.closest('.table-wrapper')) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            table.parentNode?.insertBefore(wrapper, table);
            wrapper.appendChild(table);

            const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim() || '');
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach((row) => {
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    if (headers[index]) {
                        cell.setAttribute('data-label', headers[index]);
                    }
                });
            });
        });
    }, [content]);

    const dateString = date.toISOString().split('T')[0];
    const tagFilters = tags.map(tag => `tag:${tag}`).join(' ');

    return (
        <div 
            data-pagefind-body 
            data-pagefind-filter={`type:blog ${tagFilters}`}
            data-pagefind-sort={`date:${dateString}`}
            className="prose prose-gray max-w-none dark:prose-invert"
        >
            <div
                ref={contentRef}
                dangerouslySetInnerHTML={{ __html: content }}
                suppressHydrationWarning
            />
        </div>
    );
}
