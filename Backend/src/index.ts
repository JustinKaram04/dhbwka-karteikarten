import { Request, Response } from 'express';
const express = require('express');
const app = express();
const port = process.env.PORT || 3100;
app.use(express.json());
const demoFlashcards: { id: string; question: string; answer: string; learningProgress: number }[] = [
  { id: '1', question: 'What is Node.js?', answer: 'A JavaScript runtime built on Chrome\'s V8 engine.', learningProgress: 0 },
  { id: '2', question: 'What is Express?', answer: 'Minimalist web framework for Node.js.', learningProgress: 0 }
];
app.get('/api/flashcards', (req: Request, res: Response) => {
  res.json(demoFlashcards);
});
app.post('/api/flashcards', (req: Request, res: Response) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required.' });
  const newCard = { id: String(demoFlashcards.length + 1), question, answer, learningProgress: 0 };
  demoFlashcards.push(newCard);
  res.status(201).json(newCard);
});
app.put('/api/flashcards/:id/progress', (req: Request, res: Response) => {
  const { id } = req.params;
  const { learningProgress } = req.body;
  const card = demoFlashcards.find(c => c.id === id);
  if (!card) return res.status(404).json({ error: 'Card not found.' });
  card.learningProgress = learningProgress;
  res.json(card);
});
app.listen(port, () => console.log(`Server running on port ${port}`));
