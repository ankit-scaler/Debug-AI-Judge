import { expect, test } from 'vitest';
import { listQuestions } from './list-questions';

test('lists every question directory', async () => {
  const list = await listQuestions();
  const slugs = list.map((q) => q.slug);
  expect(slugs).toContain('flipkart-cart');
  expect(slugs).toContain('swiggy-order-tracking');
  expect(slugs).toContain('makemytrip-flight-search');
  expect(slugs).toContain('zomato-restaurant-discovery');
  expect(slugs).toContain('taskforge-board');
});

// questions/"Standard Flipkart Question" is reference material someone
// dropped into the questions/ tree directly (no question.json of its own) --
// this must not crash the homepage.
test('a directory under questions/ with no question.json is skipped, not a crash', async () => {
  const list = await listQuestions();
  const slugs = list.map((q) => q.slug);
  expect(slugs).not.toContain('Standard Flipkart Question');
});

test('summaries are sorted by slug', async () => {
  const list = await listQuestions();
  const slugs = list.map((q) => q.slug);
  expect(slugs).toEqual([...slugs].sort());
});

// Same leak concern as load-question.test.ts: a summary is served to a
// browser before the learner has even opened the question.
test('summaries carry no rubric, no entry path, no handlers path', async () => {
  const list = await listQuestions();
  const payload = JSON.stringify(list);
  expect(payload).not.toContain('rubric');
  expect(payload).not.toContain('root_cause');
  expect(payload).not.toContain('anti_shortcut');
  expect(payload).not.toContain('handlersPath');
  expect(payload).not.toContain('entry');
  expect(payload).not.toContain('hints');
});

test('each summary carries what a list card needs', async () => {
  const list = await listQuestions();
  const flipkart = list.find((q) => q.slug === 'flipkart-cart');
  expect(flipkart).toBeDefined();
  expect(flipkart?.title).toBeTruthy();
  expect(flipkart?.company).toBe('Flipkart');
  expect(flipkart?.difficulty).toBeTruthy();
  expect(flipkart?.tags.length).toBeGreaterThan(0);
  expect(flipkart?.scenario).toBeTruthy();
});
