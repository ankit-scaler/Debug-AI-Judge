import { listQuestions } from '@/src/questions/list-questions';

export async function GET() {
  const questions = await listQuestions();
  return Response.json({ questions });
}
