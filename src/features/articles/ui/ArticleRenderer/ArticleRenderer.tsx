import React, {JSX} from 'react';
import styles from './index.module.scss';
import {OutputData} from "@/features/articles/model/entities/outputData";
import Image from "next/image";
// import AdSenseAd from "@/shared/ui/AdSenseAd/AdSenseAd"; // Google AdSense – uncomment when site is approved

// const IN_ARTICLE_AD_SLOT = '8774714496';

type Props = {
    data: OutputData;
};

const ArticleRenderer: React.FC<Props> = ({ data }) => {
    if (!data || !data.blocks) return null;
    
    let headingIndex = 0;
    let inArticleAdInserted = false;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderBlock = (block: any, index: number) => {
        const { type, data } = block;

        switch (type) {
            case 'paragraph':
                return <p key={index} dangerouslySetInnerHTML={{ __html: data.text }} />;
            case 'header': {
                const Tag = `h${data.level}` as keyof JSX.IntrinsicElements;
                const headingEl = (data.level === 2 || data.level === 3) ? (
                    (() => {
                        const cleanText = data.text.replace(/<[^>]*>/g, '').trim();
                        const id = `heading-${headingIndex}-${cleanText
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '')}`;
                        headingIndex++;
                        return <Tag key={index} id={id} dangerouslySetInnerHTML={{ __html: data.text }} />;
                    })()
                ) : (
                    <Tag key={index} dangerouslySetInnerHTML={{ __html: data.text }} />
                );
                // Google AdSense in-article – uncomment when site is approved
                // if (data.level === 2 && !inArticleAdInserted) {
                //     inArticleAdInserted = true;
                //     return (
                //         <React.Fragment key={index}>
                //             {headingEl}
                //             <AdSenseAd adSlot={IN_ARTICLE_AD_SLOT} adFormat="fluid" className={styles.inArticleAd} />
                //         </React.Fragment>
                //     );
                // }
                return headingEl;
            }
            case 'list':
                const items = (block.data.items as (string | { content?: string })[]).map((item, idx) => (
                    <li key={idx}>{typeof item === 'string' ? item : item?.content ?? ''}</li>
                ));

                return block.data.style === 'ordered' ? <ol key={block.id}>{items}</ol> : <ul key={block.id}>{items}</ul>;
            case 'quote':
                return (
                    <blockquote key={block.id}>
                        <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                        {data.caption && <cite>— {data.caption}</cite>}
                    </blockquote>
                );
            case 'image':
                return (
                    <div key={block.id} style={{position: 'relative', width: '100%', aspectRatio: '16 / 9', marginTop: '1em'}}>
                        <Image
                            src={block.data.file.url}
                            alt={block.data.caption || 'Article image'}
                            fill
                            style={{objectFit: 'cover'}}
                            priority
                        />
                    </div>
                );
            case 'delimiter':
                return <hr key={index}/>;
            case 'code':
                return (
                    <pre key={index}>
            <code>{data.code}</code>
          </pre>
                );
            case 'raw':
                return <div key={index} dangerouslySetInnerHTML={{ __html: data.html }} />;
            case 'table':
                return (
                    <table key={index}>
                        <tbody>
                        {data.content.map((row: string[], rowIndex: number) => (
                            <tr key={rowIndex}>
                                {row.map((cell: string, cellIndex: number) => (
                                    <td key={cellIndex} dangerouslySetInnerHTML={{ __html: cell }} />
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                );
            case 'checklist':
                return (
                    <ul key={index} className={styles.checklist}>
                        {data.items.map((item: { checked: boolean, text: string }, i: number) => (
                            <li key={i}>
                                <input type="checkbox" checked={item.checked} readOnly />
                                <span>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                );
            case 'embed':
                return (
                    <div key={index} className={styles.embed}>
                        <iframe
                            src={data.embed}
                            width={data.width}
                            height={data.height}
                            title={data.caption || 'Embedded content'}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                        {data.caption && <p>{data.caption}</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    return <div className={styles.article}>{data.blocks.map(renderBlock)}</div>;
};

export default ArticleRenderer;
