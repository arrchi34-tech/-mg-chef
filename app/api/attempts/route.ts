import { env } from 'cloudflare:workers';
import { isManagerSession } from '../manager-auth';
import { ensureSchema } from '../db';
import { gradeAttempt } from '../../grading';
import { getStaffSessionMemberId } from '../staff-auth';

type AttemptRow = {
  id: number;
  employee_name: string;
  category_id: string;
  category_title: string;
  score: number;
  total: number;
  passed: number;
  answers_json: string | null;
  completed_at: string;
};

function toAttempt(row: AttemptRow) {
  return {
    id: row.id,
    employeeName: row.employee_name,
    categoryId: row.category_id,
    categoryTitle: row.category_title,
    score: row.score,
    total: row.total,
    passed: Boolean(row.passed),
    answers: row.answers_json ? JSON.parse(row.answers_json) as number[] : null,
    completedAt: row.completed_at,
  };
}

export async function GET(request: Request) {
  await ensureSchema();
  const manager = await isManagerSession(request);
  const staffMemberId = manager ? null : await getStaffSessionMemberId(request);
  if (!manager && !staffMemberId) return Response.json({ error: 'Требуется вход.' }, { status: 401 });
  const staff = staffMemberId ? await env.DB.prepare('SELECT name FROM team_members WHERE id = ? AND active = 1').bind(staffMemberId).first<{ name: string }>() : null;
  if (!manager && !staff) return Response.json({ error: 'Сессия сотрудника истекла.' }, { status: 401 });
  const query = `SELECT id, employee_name, category_id, category_title, score, total, passed, completed_at
    , answers_json FROM attempts ${manager ? '' : 'WHERE employee_name = ?'} ORDER BY completed_at DESC LIMIT ${manager ? '1000' : '100'}`;
  const statement = env.DB.prepare(query);
  const result = manager ? await statement.all<AttemptRow>() : await statement.bind(staff!.name).all<AttemptRow>();
  return Response.json({ attempts: result.results.map(toAttempt) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const staffMemberId = await getStaffSessionMemberId(request);
  if (!staffMemberId) return Response.json({ error: 'Войдите как сотрудник.' }, { status: 401 });
  const staff = await env.DB.prepare('SELECT name FROM team_members WHERE id = ? AND active = 1').bind(staffMemberId).first<{ name: string }>();
  const employeeName = staff?.name ?? '';
  const categoryId = typeof body?.categoryId === 'string' ? body.categoryId.trim().slice(0, 80) : '';
  const categoryTitle = typeof body?.categoryTitle === 'string' ? body.categoryTitle.trim().slice(0, 120) : '';
  const graded = gradeAttempt(categoryId, body?.answers);

  if (!employeeName || !categoryId || !categoryTitle || !graded) {
    return Response.json({ error: 'Некорректные данные попытки.' }, { status: 400 });
  }

  await ensureSchema();
  const completedAt = new Date().toISOString();
  const { score, total, answers, passed } = graded;
  const saved = await env.DB.prepare(`INSERT INTO attempts
    (employee_name, category_id, category_title, score, total, passed, completed_at, answers_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(employeeName, categoryId, categoryTitle, score, total, Number(passed), completedAt, JSON.stringify(answers))
    .run();

  return Response.json({
    attempt: {
      id: Number(saved.meta.last_row_id), employeeName, categoryId, categoryTitle,
      score, total, passed, completedAt, answers,
    },
  }, { status: 201 });
}
