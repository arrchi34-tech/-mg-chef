export const correctAnswers: Record<string, number[]> = {
  fryer: [1, 2, 0, 1, 2, 1, 0, 1, 1, 0, 1, 2, 1, 0, 0, 0, 0, 1, 0, 1, 2, 0, 1, 0, 1, 0],
  burgers: [0, 0, 1, 1, 2, 1, 1, 2, 2, 1, 1, 0, 2, 2, 0, 2, 1, 0, 0, 1, 2, 1, 0, 1, 2, 2],
  pizza: [0, 0, 0, 0, 0, 0, 1, 0, 3, 1, 0, 0, 1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 3, 0, 0, 0],
  shawarma: [1, 0, 0, 0, 1, 2, 2, 1, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0],
  coffee: [2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  lemonades: [1, 1, 2, 2, 1, 1, 2, 0, 2, 1, 1, 1, 0, 2, 0, 0],
  asian: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 0, 2, 1, 2, 1, 2, 1, 1, 1, 2],
  russian: [2, 1, 1, 2, 3, 2, 1, 2, 1, 3, 1, 1, 0, 1, 0, 1],
  expiry: [1, 2, 2, 2, 0, 2, 2, 2, 2, 2],
  'fryer-level-2': [1, 0, 2, 3, 0, 1],
  'burgers-level-2': [1, 0, 2, 1, 0, 2],
  'pizza-level-2': [0, 1, 2, 0, 0, 2],
  'shawarma-level-2': [0, 0, 2, 2, 1, 0],
  'coffee-level-2': [2, 1, 0, 0, 0, 0],
  'lemonades-level-2': [1, 1, 0, 0, 0, 0],
  'asian-level-2': [0, 1, 2, 0, 1, 1],
  'russian-level-2': [0, 0, 0, 0, 0, 1],
};

export const passingScores: Record<string, number> = {
  fryer: 21, burgers: 21, pizza: 21, shawarma: 21, coffee: 13, lemonades: 13, asian: 21, russian: 13, expiry: 8,
  'fryer-level-2': 5, 'burgers-level-2': 5, 'pizza-level-2': 5, 'shawarma-level-2': 5,
  'coffee-level-2': 5, 'lemonades-level-2': 5, 'asian-level-2': 5, 'russian-level-2': 5,
};

export function gradeAttempt(categoryId: string, answers: unknown) {
  const correct = correctAnswers[categoryId];
  if (!correct || !Array.isArray(answers) || answers.length !== correct.length || answers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 3)) return null;
  const normalized = answers as number[];
  const score = normalized.reduce((total, answer, index) => total + Number(answer === correct[index]), 0);
  return { answers: normalized, score, total: correct.length, passed: score >= passingScores[categoryId] };
}
