/**
 * A hand-rolled markdown subset, not a dependency -- same reasoning as
 * src/terminal/diff-lines.ts: the content that needs it (one question's
 * description field, adapted from a reference README) uses a small, known
 * set of constructs, so a full markdown library would be mostly unused
 * surface. Supports: `#`/`##`/`###` headings, paragraphs, `**bold**` and
 * `` `code` `` inline spans, fenced ``` code blocks, `- ` lists (plain and
 * `- [ ]`/`- [x]` checklists), `| a | b |` tables (a cell may be a bare
 * `![alt](src)` image, for side-by-side screenshot rows), standalone
 * `![alt](src)` images, `> ` blockquotes, and `---` horizontal rules.
 * Deliberately not supported: links, nested lists, inline images mixed with
 * text -- the adapted content this renders doesn't use them.
 */

export type Inline = { kind: 'text'; value: string } | { kind: 'bold'; value: string } | { kind: 'code'; value: string };

export type TableCell = { kind: 'text'; inline: Inline[] } | { kind: 'image'; alt: string; src: string };

export type MarkdownNode =
  | { kind: 'heading'; level: 1 | 2 | 3; inline: Inline[] }
  | { kind: 'paragraph'; inline: Inline[] }
  | { kind: 'code-block'; text: string }
  | { kind: 'list'; items: { inline: Inline[]; checked?: boolean }[] }
  | { kind: 'table'; header: TableCell[]; rows: TableCell[][] }
  | { kind: 'image'; alt: string; src: string }
  | { kind: 'blockquote'; inline: Inline[] }
  | { kind: 'hr' };

const IMAGE_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const HEADING_RE = /^(#{1,3})\s+(.*)$/;
const LIST_ITEM_RE = /^-\s+(.*)$/;
const CHECKLIST_ITEM_RE = /^\[([ xX])\]\s*(.*)$/;
const TABLE_ROW_RE = /^\|(.*)\|$/;
const TABLE_SEPARATOR_CELL_RE = /^:?-+:?$/;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*\*(.+?)\*\*|`([^`]+?)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ kind: 'text', value: text.slice(last, m.index) });
    const bold = m[1];
    const code = m[2];
    if (bold !== undefined) out.push({ kind: 'bold', value: bold });
    else out.push({ kind: 'code', value: code ?? '' });
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ kind: 'text', value: text.slice(last) });
  return out;
}

function parseTableRow(line: string): string[] {
  const inner = line.slice(1, -1);
  return inner.split('|').map((c) => c.trim());
}

function parseTableCell(raw: string): TableCell {
  const img = IMAGE_RE.exec(raw);
  if (img) return { kind: 'image', alt: img[1] ?? '', src: img[2] ?? '' };
  return { kind: 'text', inline: parseInline(raw) };
}

/** A small helper so every loop below reads the current line once, instead
 * of re-indexing `lines[i]` (and re-asserting non-null) at every use. */
function lineAt(lines: string[], i: number): string {
  return i < lines.length ? (lines[i] ?? '') : '';
}

export function parseMarkdown(text: string): MarkdownNode[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const nodes: MarkdownNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lineAt(lines, i).trim();

    if (trimmed === '') {
      i++;
      continue;
    }

    const heading = HEADING_RE.exec(trimmed);
    if (heading) {
      const hashes = heading[1] ?? '';
      const rest = heading[2] ?? '';
      nodes.push({ kind: 'heading', level: hashes.length as 1 | 2 | 3, inline: parseInline(rest) });
      i++;
      continue;
    }

    if (trimmed === '---') {
      nodes.push({ kind: 'hr' });
      i++;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lineAt(lines, i).trim().startsWith('```')) {
        codeLines.push(lineAt(lines, i));
        i++;
      }
      i++; // skip closing fence
      nodes.push({ kind: 'code-block', text: codeLines.join('\n') });
      continue;
    }

    const soloImage = IMAGE_RE.exec(trimmed);
    if (soloImage) {
      nodes.push({ kind: 'image', alt: soloImage[1] ?? '', src: soloImage[2] ?? '' });
      i++;
      continue;
    }

    if (TABLE_ROW_RE.test(trimmed)) {
      const headerCells = parseTableRow(trimmed);
      const next = lineAt(lines, i + 1).trim();
      if (TABLE_ROW_RE.test(next) && parseTableRow(next).every((c) => TABLE_SEPARATOR_CELL_RE.test(c))) {
        i += 2;
        const rows: TableCell[][] = [];
        while (i < lines.length && TABLE_ROW_RE.test(lineAt(lines, i).trim())) {
          rows.push(parseTableRow(lineAt(lines, i).trim()).map(parseTableCell));
          i++;
        }
        nodes.push({ kind: 'table', header: headerCells.map(parseTableCell), rows });
        continue;
      }
    }

    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lineAt(lines, i).trim().startsWith('> ')) {
        quoteLines.push(lineAt(lines, i).trim().slice(2));
        i++;
      }
      nodes.push({ kind: 'blockquote', inline: parseInline(quoteLines.join(' ')) });
      continue;
    }

    if (LIST_ITEM_RE.test(trimmed)) {
      const items: { inline: Inline[]; checked?: boolean }[] = [];
      while (i < lines.length) {
        const itemMatch = LIST_ITEM_RE.exec(lineAt(lines, i).trim());
        if (!itemMatch) break;
        const rest = itemMatch[1] ?? '';
        const checklist = CHECKLIST_ITEM_RE.exec(rest);
        if (checklist) {
          const box = checklist[1] ?? ' ';
          const label = checklist[2] ?? '';
          items.push({ inline: parseInline(label), checked: box.toLowerCase() === 'x' });
        } else {
          items.push({ inline: parseInline(rest) });
        }
        i++;
      }
      nodes.push({ kind: 'list', items });
      continue;
    }

    // Paragraph: consume consecutive plain lines until a blank line or a new
    // block-level construct starts.
    const paraLines: string[] = [];
    while (i < lines.length) {
      const l = lineAt(lines, i).trim();
      if (
        l === '' ||
        HEADING_RE.test(l) ||
        l === '---' ||
        l.startsWith('```') ||
        IMAGE_RE.test(l) ||
        TABLE_ROW_RE.test(l) ||
        l.startsWith('> ') ||
        LIST_ITEM_RE.test(l)
      ) {
        break;
      }
      paraLines.push(l);
      i++;
    }
    nodes.push({ kind: 'paragraph', inline: parseInline(paraLines.join(' ')) });
  }

  return nodes;
}
