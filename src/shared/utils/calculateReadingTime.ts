import { OutputData, ParagraphBlock, HeaderBlock, ListBlock, QuoteBlock, CodeBlock, RawBlock, ChecklistBlock, TableBlock } from '@/features/articles/model/entities/outputData';

/**
 * Calculate reading time in minutes based on article content
 * Average reading speed: 200-250 words per minute
 * We use 225 words per minute as a standard
 */
export function calculateReadingTime(content: OutputData): number {
    if (!content || !content.blocks) {
        return 1; // Default to 1 minute for empty content
    }

    let wordCount = 0;

    content.blocks.forEach((block) => {
        switch (block.type) {
            case 'paragraph': {
                const paragraphBlock = block as ParagraphBlock;
                // Strip HTML tags and count words
                const paragraphText = paragraphBlock.data.text.replace(/<[^>]*>/g, ' ').trim();
                wordCount += paragraphText.split(/\s+/).filter(word => word.length > 0).length;
                break;
            }
            case 'header': {
                const headerBlock = block as HeaderBlock;
                wordCount += headerBlock.data.text.split(/\s+/).filter(word => word.length > 0).length;
                break;
            }
            case 'list': {
                const listBlock = block as ListBlock;
                if (Array.isArray(listBlock.data.items)) {
                    listBlock.data.items.forEach((item: string) => {
                        const text = typeof item === 'string' ? item : '';
                        wordCount += text.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(word => word.length > 0).length;
                    });
                }
                break;
            }
            case 'quote': {
                const quoteBlock = block as QuoteBlock;
                const quoteText = quoteBlock.data.text.replace(/<[^>]*>/g, ' ').trim();
                wordCount += quoteText.split(/\s+/).filter(word => word.length > 0).length;
                break;
            }
            case 'code': {
                const codeBlock = block as CodeBlock;
                // Code blocks typically read slower, but we'll count them normally
                wordCount += codeBlock.data.code.split(/\s+/).filter(word => word.length > 0).length;
                break;
            }
            case 'raw': {
                const rawBlock = block as RawBlock;
                const rawText = rawBlock.data.html.replace(/<[^>]*>/g, ' ').trim();
                wordCount += rawText.split(/\s+/).filter(word => word.length > 0).length;
                break;
            }
            case 'checklist': {
                const checklistBlock = block as ChecklistBlock;
                if (checklistBlock.data.items) {
                    checklistBlock.data.items.forEach((item) => {
                        wordCount += item.text.split(/\s+/).filter(word => word.length > 0).length;
                    });
                }
                break;
            }
            case 'table': {
                const tableBlock = block as TableBlock;
                if (tableBlock.data.content) {
                    tableBlock.data.content.forEach((row: string[]) => {
                        row.forEach((cell: string) => {
                            const cellText = cell.replace(/<[^>]*>/g, ' ').trim();
                            wordCount += cellText.split(/\s+/).filter(word => word.length > 0).length;
                        });
                    });
                }
                break;
            }
        }
    });

    // Calculate reading time: words / words per minute
    // Use 225 words per minute as standard reading speed
    const readingTime = Math.ceil(wordCount / 225);
    
    // Minimum 1 minute
    return Math.max(1, readingTime);
}

