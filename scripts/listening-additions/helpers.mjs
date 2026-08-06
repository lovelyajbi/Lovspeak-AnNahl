const TAGS = ['warmly', 'thoughtful', 'calmly', 'honestly', 'reflective', 'gently', 'encouraging', 'relieved'];

const parseLines = (text) => text.split('|').map((line) => line.trim()).filter(Boolean);

const tagLine = (speaker, text, index) => `${speaker}: [${TAGS[index % TAGS.length]}] ${text}`;

export const monologue = ({ id, title, level, themeId, voice = 'female', text, quiz }) => {
  const lines = parseLines(text);
  return {
    id,
    title,
    level,
    themeId,
    type: 'monologue',
    speakers: [{ name: 'Narrator', gender: voice }],
    script: lines.map((line, index) => tagLine('Narrator', line, index)),
    quiz,
  };
};

export const dialogue = ({ id, title, level, themeId, speakers, text, quiz }) => {
  const lines = parseLines(text);
  return {
    id,
    title,
    level,
    themeId,
    type: 'dialogue',
    speakers,
    script: lines.map((line, index) => tagLine(speakers[index % 2].name, line, index)),
    quiz,
  };
};

export const q = (question, correct, wrong1, wrong2, wrong3, explanation) => ({
  question,
  options: [correct, wrong1, wrong2, wrong3],
  correctIndex: 0,
  explanation,
});

