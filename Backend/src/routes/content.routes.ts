import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/authenticate';
import { Topic }    from '../entity/Topic';
import { Subtopic } from '../entity/Subtopic';
import { Flashcard } from '../entity/Flashcard';

const router = Router();

// GET /api/topics
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  // Lade alle Topics des Users, inkl. der Subtopics
  const topics = await Topic.find({
    where: { owner: { id: user.id } },
    relations: ['subtopics']
  });
  res.json(topics);
});


// POST /api/topics
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  const { name, description } = req.body;

  const topic = Topic.create({ name, description, owner: user });
  await topic.save();
  res.status(201).json(topic);
});


// PUT /api/topics/:topicId
router.put('/:topicId', authenticate, async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  const topicId = parseInt(req.params.topicId, 10);
  if (isNaN(topicId)) {
    res.status(400).json({ error: 'Ungültige Topic‐ID' });
    return;
  }

  const { name, description } = req.body;
  const topic = await Topic.findOne({
    where: { id: topicId },
    relations: ['owner']
  });
  if (!topic) {
    res.status(404).json({ error: 'Topic nicht gefunden.' });
    return;
  }
  // Prüfen, ob der eingeloggte User Owner ist
  if (topic.owner.id !== user.id) {
    res.status(403).json({ error: 'Keine Berechtigung.' });
    return;
  }

  if (name !== undefined) {
    topic.name = name;
  }
  if (description !== undefined) {
    topic.description = description;
  }
  await topic.save();
  res.json(topic);
});


// DELETE /api/topics/:topicId
router.delete('/:topicId', authenticate, async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  const topicId = parseInt(req.params.topicId, 10);
  if (isNaN(topicId)) {
    res.status(400).json({ error: 'Ungültige Topic‐ID' });
    return;
  }

  const topic = await Topic.findOne({
    where: { id: topicId },
    relations: ['owner']
  });
  if (!topic) {
    res.status(404).json({ error: 'Topic nicht gefunden.' });
    return;
  }
  if (topic.owner.id !== user.id) {
    res.status(403).json({ error: 'Keine Berechtigung.' });
    return;
  }

  await topic.remove();
  res.status(204).end();
});


// GET /api/topics/:topicId/subtopics
router.get('/:topicId/subtopics', authenticate, async (req: Request, res: Response): Promise<void> => {
  const topicId = parseInt(req.params.topicId, 10);
  if (isNaN(topicId)) {
    res.status(400).json({ error: 'Ungültige Topic‐ID' });
    return;
  }

  const subtopics = await Subtopic.find({
    where: { topic: { id: topicId } },
    relations: ['flashcards']
  });
  res.json(subtopics);
});


// POST /api/topics/:topicId/subtopics
router.post('/:topicId/subtopics', authenticate, async (req: Request, res: Response): Promise<void> => {
  const topicId = parseInt(req.params.topicId, 10);
  if (isNaN(topicId)) {
    res.status(400).json({ error: 'Ungültige Topic‐ID' });
    return;
  }

  const { name, description } = req.body;
  const topic = await Topic.findOneBy({ id: topicId });
  if (!topic) {
    res.status(404).json({ error: 'Topic nicht gefunden.' });
    return;
  }

  const subtopic = Subtopic.create({ name, description, topic });
  await subtopic.save();
  res.status(201).json(subtopic);
});


// PUT /api/topics/:topicId/subtopics/:subtopicId
router.put('/:topicId/subtopics/:subtopicId', authenticate, async (req: Request, res: Response): Promise<void> => {
  const topicId    = parseInt(req.params.topicId, 10);
  const subtopicId = parseInt(req.params.subtopicId, 10);
  if (isNaN(topicId) || isNaN(subtopicId)) {
    res.status(400).json({ error: 'Ungültige IDs' });
    return;
  }

  const { name, description } = req.body;
  const subtopic = await Subtopic.findOne({
    where: { id: subtopicId },
    relations: ['topic']
  });
  if (!subtopic) {
    res.status(404).json({ error: 'Subtopic nicht gefunden.' });
    return;
  }
  // Prüfen, ob das Subtopic zu genau diesem Topic gehört
  if (subtopic.topic.id !== topicId) {
    res.status(400).json({ error: 'Subtopic gehört nicht zu diesem Topic.' });
    return;
  }

  if (name !== undefined) {
    subtopic.name = name;
  }
  if (description !== undefined) {
    subtopic.description = description;
  }
  await subtopic.save();
  res.json(subtopic);
});


// DELETE /api/topics/:topicId/subtopics/:subtopicId
router.delete('/:topicId/subtopics/:subtopicId', authenticate, async (req: Request, res: Response): Promise<void> => {
  const topicId    = parseInt(req.params.topicId, 10);
  const subtopicId = parseInt(req.params.subtopicId, 10);
  if (isNaN(topicId) || isNaN(subtopicId)) {
    res.status(400).json({ error: 'Ungültige IDs' });
    return;
  }

  const subtopic = await Subtopic.findOne({
    where: { id: subtopicId },
    relations: ['topic']
  });
  if (!subtopic) {
    res.status(404).json({ error: 'Subtopic nicht gefunden.' });
    return;
  }
  if (subtopic.topic.id !== topicId) {
    res.status(400).json({ error: 'Subtopic gehört nicht zu diesem Topic.' });
    return;
  }

  await subtopic.remove();
  res.status(204).end();
});


// GET /api/topics/:topicId/subtopics/:subtopicId/flashcards
router.get('/:topicId/subtopics/:subtopicId/flashcards', authenticate, async (req: Request, res: Response): Promise<void> => {
  const subtopicId = parseInt(req.params.subtopicId, 10);
  if (isNaN(subtopicId)) {
    res.status(400).json({ error: 'Ungültige Subtopic‐ID' });
    return;
  }

  const cards = await Flashcard.find({
    where: { subtopic: { id: subtopicId } }
  });
  res.json(cards);
});


// POST /api/topics/:topicId/subtopics/:subtopicId/flashcards
router.post('/:topicId/subtopics/:subtopicId/flashcards', authenticate, async (req: Request, res: Response): Promise<void> => {
  const subtopicId = parseInt(req.params.subtopicId, 10);
  if (isNaN(subtopicId)) {
    res.status(400).json({ error: 'Ungültige Subtopic‐ID' });
    return;
  }

  const { question, answer } = req.body;
  const subtopic = await Subtopic.findOneBy({ id: subtopicId });
  if (!subtopic) {
    res.status(404).json({ error: 'Subtopic nicht gefunden.' });
    return;
  }

  const card = Flashcard.create({ question, answer, subtopic });
  await card.save();
  res.status(201).json(card);
});


// PUT /api/topics/:topicId/subtopics/:subtopicId/flashcards/:cardId
router.put('/:topicId/subtopics/:subtopicId/flashcards/:cardId', authenticate, async (req: Request, res: Response): Promise<void> => {
  const subtopicId = parseInt(req.params.subtopicId, 10);
  const cardId     = parseInt(req.params.cardId, 10);
  if (isNaN(subtopicId) || isNaN(cardId)) {
    res.status(400).json({ error: 'Ungültige IDs' });
    return;
  }

  const { question, answer } = req.body;
  const card = await Flashcard.findOne({
    where: { id: cardId },
    relations: ['subtopic']
  });
  if (!card) {
    res.status(404).json({ error: 'Flashcard nicht gefunden.' });
    return;
  }
  if (card.subtopic.id !== subtopicId) {
    res.status(400).json({ error: 'Flashcard gehört nicht zu diesem Subtopic.' });
    return;
  }

  if (question !== undefined) {
    card.question = question;
  }
  if (answer !== undefined) {
    card.answer = answer;
  }
  await card.save();
  res.json(card);
});

// PATCH: Lernstand oder istoggled einer Flashcard aktualisieren
// PATCH /api/topics/:topicId/subtopics/:subtopicId/flashcards/:cardId
router.patch('/:topicId/subtopics/:subtopicId/flashcards/:cardId', authenticate, async (req: Request, res: Response): Promise<void> => {
  const subtopicId = parseInt(req.params.subtopicId, 10);
  const cardId     = parseInt(req.params.cardId, 10);
  if (isNaN(subtopicId) || isNaN(cardId)) {
    res.status(400).json({ error: 'Ungültige IDs' });
    return;
  }

  const { learningProgress, istoggled } = req.body;
  const card = await Flashcard.findOne({
    where: { id: cardId },
    relations: ['subtopic']
  });
  if (!card) {
    res.status(404).json({ error: 'Flashcard nicht gefunden.' });
    return;
  }
  if (card.subtopic.id !== subtopicId) {
    res.status(400).json({ error: 'Flashcard gehört nicht zu diesem Subtopic.' });
    return;
  }

  if (learningProgress !== undefined) {
    card.learningProgress = learningProgress;
  }
  if (istoggled !== undefined) {
    card.istoggled = istoggled;
  }
  await card.save();
  res.json(card);
});


// DELETE /api/topics/:topicId/subtopics/:subtopicId/flashcards/:cardId
router.delete('/:topicId/subtopics/:subtopicId/flashcards/:cardId', authenticate, async (req: Request, res: Response): Promise<void> => {
  const subtopicId = parseInt(req.params.subtopicId, 10);
  const cardId     = parseInt(req.params.cardId, 10);
  if (isNaN(subtopicId) || isNaN(cardId)) {
    res.status(400).json({ error: 'Ungültige IDs' });
    return;
  }

  const card = await Flashcard.findOne({
    where: { id: cardId },
    relations: ['subtopic']
  });
  if (!card) {
    res.status(404).json({ error: 'Flashcard nicht gefunden.' });
    return;
  }
  if (card.subtopic.id !== subtopicId) {
    res.status(400).json({ error: 'Flashcard gehört nicht zu diesem Subtopic.' });
    return;
  }

  await card.remove();
  res.status(204).end();
});

// ───────────────────────────────────────────────────────────────────────────────

export default router;
