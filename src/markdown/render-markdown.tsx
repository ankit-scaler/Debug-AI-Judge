import type { ReactNode } from 'react';
import { parseMarkdown, type Inline, type MarkdownNode, type TableCell } from './parse-markdown';
import styles from './markdown.module.css';

function renderInline(inline: Inline[], keyPrefix: string): ReactNode[] {
  return inline.map((node, i) => {
    const key = `${keyPrefix}-${i}`;
    if (node.kind === 'bold') return <strong key={key}>{node.value}</strong>;
    if (node.kind === 'code') return (
      <code key={key} className={styles.code}>
        {node.value}
      </code>
    );
    return node.value;
  });
}

function renderCell(cell: TableCell, key: string): ReactNode {
  if (cell.kind === 'image') return <img key={key} className={styles.tableImage} src={cell.src} alt={cell.alt} />;
  return renderInline(cell.inline, key);
}

const HEADING_TAG = { 1: 'h2', 2: 'h3', 3: 'h4' } as const;

export function renderMarkdown(text: string): ReactNode {
  const nodes = parseMarkdown(text);
  return <>{nodes.map((node, i) => renderNode(node, `md-${i}`))}</>;
}

function renderNode(node: MarkdownNode, key: string): ReactNode {
  switch (node.kind) {
    case 'heading': {
      const Tag = HEADING_TAG[node.level];
      return (
        <Tag key={key} className={styles.heading}>
          {renderInline(node.inline, key)}
        </Tag>
      );
    }
    case 'paragraph':
      return (
        <p key={key} className={styles.paragraph}>
          {renderInline(node.inline, key)}
        </p>
      );
    case 'code-block':
      return (
        <pre key={key} className={styles.pre}>
          <code>{node.text}</code>
        </pre>
      );
    case 'list':
      return (
        <ul key={key} className={styles.list}>
          {node.items.map((item, i) => (
            <li key={`${key}-${i}`} className={styles.listItem}>
              {item.checked !== undefined ? (
                <input type="checkbox" checked={item.checked} disabled className={styles.checkbox} />
              ) : null}
              {renderInline(item.inline, `${key}-${i}`)}
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <table key={key} className={styles.table}>
          <thead>
            <tr>
              {node.header.map((cell, i) => (
                <th key={`${key}-h-${i}`}>{renderCell(cell, `${key}-h-${i}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {node.rows.map((row, i) => (
              <tr key={`${key}-r-${i}`}>
                {row.map((cell, j) => (
                  <td key={`${key}-r-${i}-${j}`}>{renderCell(cell, `${key}-r-${i}-${j}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'image':
      return <img key={key} className={styles.image} src={node.src} alt={node.alt} />;
    case 'blockquote':
      return (
        <blockquote key={key} className={styles.blockquote}>
          {renderInline(node.inline, key)}
        </blockquote>
      );
    case 'hr':
      return <hr key={key} className={styles.hr} />;
  }
}
