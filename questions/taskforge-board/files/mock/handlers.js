// Mock API for this question. Read-only.
const TASKS = [
  { id: 1, title: 'Fix login bug', assignee: 'AK', priority: 1, done: false },
  { id: 2, title: 'Write onboarding docs', assignee: 'RS', priority: 2, done: false },
  { id: 3, title: 'Review PR #482', assignee: 'AK', priority: 1, done: false },
  { id: 4, title: 'Update dependency versions', assignee: 'RS', priority: 3, done: false },
];

// One literal endpoint per task id, since the preview's fetch interceptor
// matches an exact pathname rather than a pattern like "/api/tasks/:id".
function makePatchHandler(id) {
  return {
    method: 'PATCH',
    path: `/api/tasks/${id}`,
    handler: async (req) => {
      const { done } = JSON.parse(req.body);
      const task = TASKS.find((t) => t.id === id);
      if (task) task.done = done;
      return { status: 200, body: { task } };
    },
  };
}

export const handlers = [
  {
    method: 'GET',
    path: '/api/tasks',
    handler: async () => ({ status: 200, body: { tasks: TASKS } }),
  },
  makePatchHandler(1),
  makePatchHandler(2),
  makePatchHandler(3),
  makePatchHandler(4),
];
