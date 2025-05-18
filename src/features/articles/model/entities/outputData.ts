export type OutputData = {
    time: number;
    version: string;
    blocks: Block[];
};

export type Block =
    | ParagraphBlock
    | HeaderBlock
    | ImageBlock
    | ListBlock
    | CodeBlock
    | QuoteBlock
    | DelimiterBlock
    | TableBlock
    | ChecklistBlock
    | EmbedBlock
    | RawBlock
    | MarkerBlock
    | LinkToolBlock
    | WarningBlock
    | UnknownBlock;

export type ParagraphBlock = {
    type: 'paragraph';
    data: {
        text: string;
    };
};

export type HeaderBlock = {
    type: 'header';
    data: {
        text: string;
        level: number;
    };
};

export type ImageBlock = {
    type: 'image';
    data: {
        file: {
            url: string;
        };
        caption?: string;
        withBorder?: boolean;
        stretched?: boolean;
        withBackground?: boolean;
    };
};

export type ListBlock = {
    type: 'list';
    data: {
        style: 'ordered' | 'unordered';
        items: string[];
    };
};

export type CodeBlock = {
    type: 'code';
    data: {
        code: string;
    };
};

export type QuoteBlock = {
    type: 'quote';
    data: {
        text: string;
        caption?: string;
        alignment?: 'left' | 'center';
    };
};

export type DelimiterBlock = {
    type: 'delimiter';
    data: object;
};

export type TableBlock = {
    type: 'table';
    data: {
        content: string[][];
    };
};

export type ChecklistBlock = {
    type: 'checklist';
    data: {
        items: {
            text: string;
            checked: boolean;
        }[];
    };
};

export type EmbedBlock = {
    type: 'embed';
    data: {
        service: string;
        source: string;
        embed: string;
        width: number;
        height: number;
        caption?: string;
    };
};

export type RawBlock = {
    type: 'raw';
    data: {
        html: string;
    };
};

export type MarkerBlock = {
    type: 'marker';
    data: {
        text: string;
    };
};

export type LinkToolBlock = {
    type: 'linkTool';
    data: {
        link: string;
        meta: {
            title: string;
            description?: string;
            image?: {
                url: string;
            };
        };
    };
};

export type WarningBlock = {
    type: 'warning';
    data: {
        title: string;
        message: string;
    };
};

export type UnknownBlock = {
    type: string;
    data: Record<string, unknown>;
};
