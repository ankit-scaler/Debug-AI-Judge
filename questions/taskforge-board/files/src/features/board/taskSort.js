/** Incomplete tasks first (by priority, 1 = highest), then completed ones. */
export function sortTasks(tasks) {
  const incomplete = tasks.filter((t) => !t.done).sort((a, b) => a.priority - b.priority);
  const done = tasks.filter((t) => t.done).sort((a, b) => a.priority - b.priority);
  return [...incomplete, ...done];
}
