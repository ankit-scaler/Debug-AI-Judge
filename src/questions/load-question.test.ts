import { expect, test } from 'vitest';
import { loadQuestion, toLearnerQuestion } from './load-question';

test('loads the question with every file, including hidden ones', async () => {
  const q = await loadQuestion('flipkart-cart');
  expect(q.meta.slug).toBe('flipkart-cart');
  expect(q.meta.entry).toBe('src/App.jsx');
  expect(q.questionFiles.map((f) => f.path)).toContain('notes/author-notes.md');
  expect(q.referenceFix.length).toBeGreaterThan(0);
});

test('every src file is editable; the mock API and author notes keep their restricted visibility', async () => {
  const q = await loadQuestion('flipkart-cart');
  for (const f of q.questionFiles) {
    expect(['editable', 'readonly', 'hidden']).toContain(f.visibility);
  }
  // Full-repo editing: no editable-file hint about where the bug lives. The
  // mock API and the author's notes stay restricted regardless -- see D24.
  expect(q.questionFiles.find((f) => f.path === 'src/App.jsx')?.visibility).toBe('editable');
  expect(q.questionFiles.find((f) => f.path === 'src/CartContext.jsx')?.visibility).toBe(
    'editable',
  );
  expect(q.questionFiles.find((f) => f.path === 'mock/handlers.js')?.visibility).toBe('readonly');
  expect(q.questionFiles.find((f) => f.path === 'notes/author-notes.md')?.visibility).toBe(
    'hidden',
  );
});

test('rejects a slug that could escape the questions directory', async () => {
  await expect(loadQuestion('../../etc')).rejects.toThrow(/invalid question slug/i);
  await expect(loadQuestion('Flipkart_Cart')).rejects.toThrow(/invalid question slug/i);
});

// The security test for this phase. A rubric leak hands over the grading key; a
// reference-fix leak hands over the answer; a hidden-file leak hands over the
// author's notes, which in this question name the bug outright.
test('the learner payload leaks no rubric, no reference fix and no hidden file', async () => {
  const loaded = await loadQuestion('flipkart-cart');
  const payload = JSON.stringify(toLearnerQuestion(loaded));

  // No rubric, by id or by text.
  expect(payload).not.toContain('rubric');
  for (const criterion of loaded.meta.rubric) {
    expect(payload).not.toContain(criterion.description);
    expect(payload).not.toContain(criterion.kind);
  }

  // No reference fix. The fix is `data.cart.items`; the shipped bug is `data.items`.
  for (const file of loaded.referenceFix) {
    expect(payload).not.toContain(file.content);
  }
  expect(payload).not.toContain('data.cart.items');

  // No hidden files, by path or by content.
  const hidden = loaded.questionFiles.filter((f) => f.visibility === 'hidden');
  expect(hidden.length).toBeGreaterThan(0);
  for (const file of hidden) {
    expect(payload).not.toContain(file.path);
    expect(payload).not.toContain(file.content);
  }

  // No hints upfront. Hints are revealed one at a time through their own
  // route (see app/api/questions/[slug]/hints), never bundled with the page.
  expect(loaded.meta.hints.length).toBeGreaterThan(0);
  for (const hint of loaded.meta.hints) {
    expect(payload).not.toContain(hint);
  }
});

test('the learner payload does carry what the solve screen needs', async () => {
  const learner = toLearnerQuestion(await loadQuestion('flipkart-cart'));
  expect(learner.title).toBeTruthy();
  expect(learner.symptom).toMatch(/nothing happens/i);
  expect(learner.entry).toBe('src/App.jsx');
  expect(learner.handlersPath).toBe('mock/handlers.js');
  expect(learner.files.map((f) => f.path)).toEqual([
    'mock/handlers.js',
    'src/App.css',
    'src/App.jsx',
    'src/Cart.jsx',
    'src/CartContext.jsx',
    'src/Header.jsx',
    'src/ProductList.jsx',
  ]);
  expect(learner.files.some((f) => f.visibility === 'editable')).toBe(true);
});

test('toLearnerQuestion forwards terminalCommands (an allow-list field, so it must be named)', async () => {
  const loaded = await loadQuestion('flipkart-cart');
  const terminalCommands = [{ id: 'db-inspect', command: 'npm run db:inspect', help: 'print the tables' }];
  const learner = toLearnerQuestion({ ...loaded, meta: { ...loaded.meta, terminalCommands } });
  expect(learner.terminalCommands).toEqual(terminalCommands);
});
