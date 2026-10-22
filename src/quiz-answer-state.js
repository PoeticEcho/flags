// A wrong answer keeps the same question open. Only success locks its choices.
export const canAnswerQuiz = status => status === 'idle' || status === 'wrong';

export function quizOptionResult(status, selectedId, option) {
 if (status === 'correct' && option.correct) return 'correct';
 if (status === 'wrong' && selectedId === option.id) return 'wrong';
 return '';
}
