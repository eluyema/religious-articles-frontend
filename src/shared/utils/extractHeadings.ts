import { OutputData, HeaderBlock } from '@/features/articles/model/entities/outputData';

export type HeadingItem = {
    id: string;
    text: string;
    level: number;
};

/**
 * Extract headings (h2, h3) from article content for table of contents
 */
export function extractHeadings(content: OutputData): HeadingItem[] {
    if (!content || !content.blocks) {
        return [];
    }

    const headings: HeadingItem[] = [];
    let headingIndex = 0;

    content.blocks.forEach((block) => {
        if (block.type === 'header' && (block.data.level === 2 || block.data.level === 3)) {
            const headingBlock = block as HeaderBlock;
            // Strip HTML tags from heading text
            const text = headingBlock.data.text.replace(/<[^>]*>/g, '').trim();
            
            // Generate a URL-friendly ID from the heading text
            const id = `heading-${headingIndex}-${text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')}`;
            
            headings.push({
                id,
                text,
                level: headingBlock.data.level,
            });
            
            headingIndex++;
        }
    });

    return headings;
}

