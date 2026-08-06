export const q = (question, correct, wrong1, wrong2, wrong3, explanation) => ({
  question,
  options: [correct, wrong1, wrong2, wrong3],
  correctIndex: 0,
  explanation,
});

