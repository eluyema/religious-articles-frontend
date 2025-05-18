import React, {JSX} from 'react';
import styles from './index.module.scss';
import {OutputData} from "@/features/articles/model/entities/outputData";
import Image from "next/image";

type Props = {
    data: OutputData;
};

const ArticleRenderer: React.FC<Props> = ({ data }) => {
    if (!data || !data.blocks) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderBlock = (block: any, index: number) => {
        const { type, data } = block;

        switch (type) {
            case 'paragraph':
                return <p key={index} dangerouslySetInnerHTML={{ __html: data.text }} />;
            case 'header':
                const Tag = `h${data.level}` as keyof JSX.IntrinsicElements;
                return <Tag key={index}>{data.text}</Tag>;
            case 'list':
                const items = (block.data.items as (string | { content?: string })[]).map((item, idx) => (
                    <li key={idx}>{typeof item === 'string' ? item : item?.content ?? ''}</li>
                ));

                return block.data.style === 'ordered' ? <ol key={block.id}>{items}</ol> : <ul key={block.id}>{items}</ul>;
            case 'quote':
                return (
                    <blockquote key={index}>
                        <p>{data.text}</p>
                        {data.caption && <cite>— {data.caption}</cite>}
                    </blockquote>
                );
            case 'image':
                return (
                    <div key={block.id} style={{position: 'relative', width: '100%', height: '400px'}}>
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
