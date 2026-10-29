import { expect, test } from 'vitest';
import { buildTree, type FileTreeFile } from './FileTree';

const files: FileTreeFile[] = [
  { path: 'src/App.jsx', visibility: 'readonly' },
  { path: 'mock/handlers.js', visibility: 'readonly' },
  { path: 'src/CartContext.jsx', visibility: 'editable' },
  { path: 'src/components/Cart.jsx', visibility: 'readonly' },
];

test('nests flat posix paths into folders', () => {
  const tree = buildTree(files);
  expect(tree.map((n) => n.name)).toEqual(['mock', 'src']);

  const src = tree.find((n) => n.name === 'src')!;
  // Folders sort before files, then alphabetical within each group.
  expect(src.children.map((n) => n.name)).toEqual([
    'components',
    'App.jsx',
    'CartContext.jsx',
  ]);
});

test('leaves carry their file, folders do not', () => {
  const tree = buildTree(files);
  const src = tree.find((n) => n.name === 'src')!;
  expect(src.file).toBeUndefined();

  const cartContext = src.children.find((n) => n.name === 'CartContext.jsx')!;
  expect(cartContext.file?.path).toBe('src/CartContext.jsx');
  expect(cartContext.file?.visibility).toBe('editable');
});

test('nested folders keep their full path, so collapse state cannot collide', () => {
  const tree = buildTree([
    { path: 'a/shared/x.js', visibility: 'readonly' },
    { path: 'b/shared/y.js', visibility: 'readonly' },
  ]);
  const paths = tree.flatMap((n) => n.children.map((c) => c.path));
  expect(paths).toEqual(['a/shared', 'b/shared']);
});

test('a single root-level file needs no folder', () => {
  const tree = buildTree([{ path: 'index.js', visibility: 'editable' }]);
  expect(tree).toHaveLength(1);
  expect(tree[0]!.children).toEqual([]);
  expect(tree[0]!.file?.path).toBe('index.js');
});
