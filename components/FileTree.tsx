'use client';

import { useMemo, useState } from 'react';
import styles from './solve.module.css';

export type FileVisibility = 'editable' | 'readonly' | 'hidden';

export interface FileTreeFile {
  path: string;
  visibility: FileVisibility;
}

export interface TreeNode {
  name: string;
  path: string;
  children: TreeNode[];
  file?: FileTreeFile;
}

/** Builds a nested tree from flat posix paths, folders before files, each alphabetical. */
export function buildTree(files: FileTreeFile[]): TreeNode[] {
  const root: TreeNode = { name: '', path: '', children: [] };

  for (const file of files) {
    const segments = file.path.split('/');
    let node = root;

    segments.forEach((segment, index) => {
      const isLeaf = index === segments.length - 1;
      const path = segments.slice(0, index + 1).join('/');
      let next = node.children.find((c) => c.name === segment);

      if (!next) {
        next = { name: segment, path, children: [] };
        node.children.push(next);
      }
      if (isLeaf) next.file = file;
      node = next;
    });
  }

  const sort = (nodes: TreeNode[]): TreeNode[] =>
    nodes
      .map((n) => ({ ...n, children: sort(n.children) }))
      .sort((a, b) => {
        const aFolder = a.children.length > 0;
        const bFolder = b.children.length > 0;
        if (aFolder !== bFolder) return aFolder ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

  return sort(root.children);
}

export interface FileTreeProps {
  files: FileTreeFile[];
  activePath: string;
  dirtyPaths: Set<string>;
  onSelect: (path: string) => void;
}

export function FileTree({ files, activePath, dirtyPaths, onSelect }: FileTreeProps) {
  const tree = useMemo(() => buildTree(files), [files]);
  // Folders start open: these apps are small, and hunting for the bug should not
  // start with hunting for the file.
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggle = (path: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });

  const renderNode = (node: TreeNode, depth: number): React.ReactNode => {
    const indent = { paddingLeft: `${8 + depth * 12}px` };

    if (node.children.length > 0) {
      const isCollapsed = collapsed.has(node.path);
      return (
        <li key={node.path}>
          <button
            className={styles.treeRow}
            style={indent}
            onClick={() => toggle(node.path)}
            aria-expanded={!isCollapsed}
          >
            <span className={styles.chevron} aria-hidden="true">
              {isCollapsed ? '▸' : '▾'}
            </span>
            <span className={styles.folderName}>{node.name}</span>
          </button>
          {!isCollapsed ? (
            <ul className={styles.treeList}>
              {node.children.map((child) => renderNode(child, depth + 1))}
            </ul>
          ) : null}
        </li>
      );
    }

    const file = node.file;
    if (!file) return null;
    const isActive = activePath === file.path;
    const isReadOnly = file.visibility !== 'editable';

    return (
      <li key={node.path}>
        <button
          className={`${styles.treeRow} ${isActive ? styles.treeRowActive : ''}`}
          style={indent}
          onClick={() => onSelect(file.path)}
          aria-current={isActive ? 'true' : undefined}
          title={isReadOnly ? `${file.path} — read-only` : file.path}
        >
          <span className={styles.chevron} aria-hidden="true" />
          <span className={styles.fileName}>{node.name}</span>
          {dirtyPaths.has(file.path) ? (
            <span className={styles.dirty} aria-label="Modified">
              ●
            </span>
          ) : null}
          {isReadOnly ? (
            <span className={styles.lock} aria-label="Read-only">
              ⊘
            </span>
          ) : null}
        </button>
      </li>
    );
  };

  return (
    <nav className={styles.explorer} aria-label="Files">
      <p className={styles.explorerTitle}>Explorer</p>
      <ul className={styles.treeList}>{tree.map((node) => renderNode(node, 0))}</ul>
      <p className={styles.explorerHint}>
        <span className={styles.lock}>⊘</span> read-only
      </p>
    </nav>
  );
}
