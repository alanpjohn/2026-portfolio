'use client';

import { useEffect, useMemo } from 'react';
import { enhanceImages } from '@/lib/client/image-enhancer';

interface BlogPostContentProps {
    content: string;
    tags: string[];
    date: Date;
}

// Add IDs to headings for TOC navigation
function addHeadingIds(content: string): string {
    const usedIds = new Set<string>();
    
    return content.replace(/<h([23])[^>]*>(.*?)<\/h\1>/gi, (match, level, text) => {
        // Strip HTML tags from text
        const cleanText = text.replace(/<[^>]+>/g, '');
        // Create ID from text (slugify)
        const baseId = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        
        // Ensure unique ID
        let id = baseId;
        let counter = 0;
        while (usedIds.has(id)) {
            counter++;
            id = `${baseId}-${counter}`;
        }
        usedIds.add(id);
        
        // Add ID to heading tag
        return `<h${level} id="${id}">${text}</h${level}>`;
    });
}

// Extract language from code block class
function extractLanguage(className: string): string {
    const match = className.match(/language-(\w+)/);
    return match ? match[1].toUpperCase() : 'CODE';
}

// Wrap code blocks with window title bar
function wrapCodeBlocks(content: string): string {
    // Match pre > code blocks and wrap them
    return content.replace(
        /<pre><code([^>]*)class="([^"]*)"([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
        (match, beforeClass, className, afterClass, code) => {
            const lang = extractLanguage(className);
            return `
                <div class="code-block-wrapper">
                    <div class="code-window-title">
                        <div class="code-window-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span class="code-window-lang">${lang}</span>
                    </div>
                    <pre><code${beforeClass}class="${className}"${afterClass}>${code}</code></pre>
                </div>
            `;
        }
    );
}

export function BlogPostContent({ content, tags, date }: BlogPostContentProps) {
    useEffect(() => {
        enhanceImages();
    }, []);

    const dateString = date.toISOString().split('T')[0];
    
    // Process content to add heading IDs and wrap code blocks
    const processedContent = useMemo(() => {
        let processed = addHeadingIds(content);
        processed = wrapCodeBlocks(processed);
        return processed;
    }, [content]);

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
                dangerouslySetInnerHTML={{ __html: processedContent }}
                suppressHydrationWarning
            />
        </div>
    );
}
