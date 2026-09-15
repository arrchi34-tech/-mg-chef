import { env } from 'cloudflare:workers';
import { ensureSchema } from '../db';
import { isManagerSession } from '../manager-auth';

type DeadlineRow = { category_id: string; due_date: string };

async function requireManager(request: Request) {
  return isManagerSession(request);
}

export async function GET(request: Request) {
  if (!(await requireManager(request))) return Response.json({ error: 'Требуется вход руководителя.' }, { status: 401 });
  await ensureSchema();
  const records = await env.DB.prepare('SELECT category_id, due_date FROM category_deadlines').all<DeadlineRow>();
  return Response.json({ deadlines: Object.fromEntries(records.results.map((record) => [record.category_id, record.due_date])) });
}

export async function POST(request: Request) {
  if (!(await requireManager(request))) return Response.json({ error: 'Требуется вход руководителя.' }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const deadlines = Array.isArray(body?.deadlines) ? body.deadlines : [];
  await ensureSchema();
  const valid = deadlines.filter((item): item is { categoryId: string; dueDate: string } => Boolean(item) && typeof item === 'object' && typeof (item as Record<string, unknown>).categoryId === 'string' && typeof (item as Record<string, unknown>).dueDate === 'string');
  const statements = valid.flatMap((item) => {
    const categoryId = item.categoryId.trim().slice(0, 80); const dueDate = item.dueDate.trim();
    if (!categoryId) return [];
    if (!dueDate) return [env.DB.prepare('DELETE FROM category_deadlines WHERE category_id = ?').bind(categoryId)];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return [];
    return [env.DB.prepare(`INSERT INTO category_deadlines (category_id, due_date) VALUES (?, ?)
      ON CONFLICT(category_id) DO UPDATE SET due_date = excluded.due_date`).bind(categoryId, dueDate)];
  });
  if (statements.length) await env.DB.batch(statements);
  const records = await env.DB.prepare('SELECT category_id, due_date FROM category_deadlines').all<DeadlineRow>();
  return Response.json({ deadlines: Object.fromEntries(records.results.map((record) => [record.category_id, record.due_date])) });
}
