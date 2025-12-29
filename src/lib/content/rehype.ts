import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

// Create a unified processor for markdown to HTML conversion
export const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeStringify)

export async function processMarkdown(content: string): Promise<string> {
  const result = await markdownProcessor.process(content)
  return String(result)
}