import { describe, expect, it } from 'vitest';
import { parseMarkdown } from './parse-markdown';

describe('parseMarkdown', () => {
  it('parses headings at each level', () => {
    expect(parseMarkdown('# One\n## Two\n### Three')).toEqual([
      { kind: 'heading', level: 1, inline: [{ kind: 'text', value: 'One' }] },
      { kind: 'heading', level: 2, inline: [{ kind: 'text', value: 'Two' }] },
      { kind: 'heading', level: 3, inline: [{ kind: 'text', value: 'Three' }] },
    ]);
  });

  it('parses a paragraph with mixed bold and inline code', () => {
    expect(parseMarkdown('Run `npm test` and it should be **green**.')).toEqual([
      {
        kind: 'paragraph',
        inline: [
          { kind: 'text', value: 'Run ' },
          { kind: 'code', value: 'npm test' },
          { kind: 'text', value: ' and it should be ' },
          { kind: 'bold', value: 'green' },
          { kind: 'text', value: '.' },
        ],
      },
    ]);
  });

  it('joins consecutive paragraph lines with a space', () => {
    expect(parseMarkdown('line one\nline two')).toEqual([
      { kind: 'paragraph', inline: [{ kind: 'text', value: 'line one line two' }] },
    ]);
  });

  it('parses a fenced code block verbatim, including blank lines', () => {
    expect(parseMarkdown('```\nnpm run repro -- stale\n\nnpm run db:inspect\n```')).toEqual([
      { kind: 'code-block', text: 'npm run repro -- stale\n\nnpm run db:inspect' },
    ]);
  });

  it('parses a plain list', () => {
    expect(parseMarkdown('- first\n- second')).toEqual([
      {
        kind: 'list',
        items: [
          { inline: [{ kind: 'text', value: 'first' }] },
          { inline: [{ kind: 'text', value: 'second' }] },
        ],
      },
    ]);
  });

  it('parses a checklist, tracking checked state per item', () => {
    expect(parseMarkdown('- [ ] not done\n- [x] done')).toEqual([
      {
        kind: 'list',
        items: [
          { inline: [{ kind: 'text', value: 'not done' }], checked: false },
          { inline: [{ kind: 'text', value: 'done' }], checked: true },
        ],
      },
    ]);
  });

  it('parses a table of text cells', () => {
    expect(parseMarkdown('| Test | Problem |\n|---|---|\n| foo | 1 |\n| bar | 2 |')).toEqual([
      {
        kind: 'table',
        header: [
          { kind: 'text', inline: [{ kind: 'text', value: 'Test' }] },
          { kind: 'text', inline: [{ kind: 'text', value: 'Problem' }] },
        ],
        rows: [
          [
            { kind: 'text', inline: [{ kind: 'text', value: 'foo' }] },
            { kind: 'text', inline: [{ kind: 'text', value: '1' }] },
          ],
          [
            { kind: 'text', inline: [{ kind: 'text', value: 'bar' }] },
            { kind: 'text', inline: [{ kind: 'text', value: '2' }] },
          ],
        ],
      },
    ]);
  });

  it('parses a table row whose cells are bare images', () => {
    expect(parseMarkdown('| ![a](/a.png) | ![b](/b.png) |\n|---|---|')).toEqual([
      {
        kind: 'table',
        header: [
          { kind: 'image', alt: 'a', src: '/a.png' },
          { kind: 'image', alt: 'b', src: '/b.png' },
        ],
        rows: [],
      },
    ]);
  });

  it('parses a standalone image', () => {
    expect(parseMarkdown('![cart after refresh](/img/03.png)')).toEqual([
      { kind: 'image', alt: 'cart after refresh', src: '/img/03.png' },
    ]);
  });

  it('parses a blockquote, joining its lines', () => {
    expect(parseMarkdown('> line one\n> line two')).toEqual([
      { kind: 'blockquote', inline: [{ kind: 'text', value: 'line one line two' }] },
    ]);
  });

  it('parses a horizontal rule', () => {
    expect(parseMarkdown('---')).toEqual([{ kind: 'hr' }]);
  });

  it('does not confuse a table separator row with a horizontal rule', () => {
    const result = parseMarkdown('| a |\n|---|\n| b |');
    expect(result).toEqual([{ kind: 'table', header: [{ kind: 'text', inline: [{ kind: 'text', value: 'a' }] }], rows: [[{ kind: 'text', inline: [{ kind: 'text', value: 'b' }] }]] }]);
  });

  it('parses a realistic excerpt with adjacent block types', () => {
    const text = [
      '## 4. Your goal',
      '',
      '- [ ] The badge always matches the server',
      '- [ ] `npm test` passes',
      '',
      '---',
      '',
      '## 5. Tests',
      '',
      '| Failing test | Problem |',
      '|---|---|',
      '| does not let a stale response overwrite a newer cart | 1 |',
    ].join('\n');

    const nodes = parseMarkdown(text);
    expect(nodes.map((n) => n.kind)).toEqual(['heading', 'list', 'hr', 'heading', 'table']);
    expect(nodes[1]).toEqual({
      kind: 'list',
      items: [
        { inline: [{ kind: 'text', value: 'The badge always matches the server' }], checked: false },
        { inline: [{ kind: 'code', value: 'npm test' }, { kind: 'text', value: ' passes' }], checked: false },
      ],
    });
  });
});
