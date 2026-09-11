import { env } from 'cloudflare:workers';

type AttemptRow = {
  id: number;
  employee_name: string;
  category_id: string;
  category_title: string;
  score: number;
  total: number;
  passed: number;
  completed_at: string;
};

async function ensureSchema() {
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_name TEXT NOT NULL,
      category_id TEXT NOT NULL,
      category_title TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      passed INTEGER NOT NULL,
      completed_at TEXT NOT NULL
    )`),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_attempts_completed_at ON attempts (completed_at DESC)'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_attempts_employee_name ON attempts (employee_name, completed_at DESC)'),
  ]);
}

function toAttempt(row: AttemptRow) {
  return {
    id: row.id,
    employeeName: row.employee_name,
    categoryId: row.category_id,
    categoryTitle: row.category_title,
    score: row.score,
    total: row.total,
    passed: Boolean(row.passed),
    completedAt: row.completed_at,
  };
}

export async function GET() {
  await ensureSchema();
  const result = await env.DB.prepare(`SELECT id, employee_name, category_id, category_title, score, total, passed, completed_at
    FROM attempts ORDER BY completed_at DESC LIMIT 100`).all<AttemptRow>();
  return Response.json({ attempts: result.results.map(toAttempt) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const employeeName = typeof body?.employeeName === 'string' ? body.employeeName.trim().slice(0, 120) : '';
  const categoryId = typeof body?.categoryId === 'string' ? body.categoryId.trim().slice(0, 80) : '';
  const categoryTitle = typeof body?.categoryTitle === 'string' ? body.categoryTitle.trim().slice(0, 120) : '';
  const score = typeof body?.score === 'number' ? Math.trunc(body.score) : -1;
  const total = typeof body?.total === 'number' ? Math.trunc(body.total) : -1;

  if (!employeeName || !categoryId || !categoryTitle || total < 1 || score < 0 || score > total) {
    return Response.json({ error: 'Некорректные данные попытки.' }, { status: 400 });
  }

  await ensureSchema();
  const completedAt = new Date().toISOString();
  const passingScores: Record<string, number> = { fryer: 21, burgers: 21, pizza: 21, shawarma: 21 };
  const passed = Number(score >= (passingScores[categoryId] ?? total + 1));
  const saved = await env.DB.prepare(`INSERT INTO attempts
    (employee_name, category_id, category_title, score, total, passed, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .bind(employeeName, categoryId, categoryTitle, score, total, passed, completedAt)
    .run();

  return Response.json({
    attempt: {
      id: Number(saved.meta.last_row_id), employeeName, categoryId, categoryTitle,
      score, total, passed: Boolean(passed), completedAt,
    },
  }, { status: 201 });
}
