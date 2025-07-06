import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { Flashcard } from '../entity/Flashcard';
import { Subtopic } from '../entity/Subtopic';

const paramsCreateSchema = z.object({
  subtopicId: z.coerce
    .number()
    .int()
    .positive({ message: 'Ungültige subtopicId' })
});

const paramsUpdateSchema = z.object({
  subtopicId: z.coerce
    .number()
    .int()
    .positive({ message: 'Ungültige subtopicId' }),
  cardId: z.coerce
    .number()
    .int()
    .positive({ message: 'Ungültige cardId' })
});

const bodyCreateSchema = z.object({
  question: z.string().min(1, { message: 'Frage darf nicht leer sein' }),
  answer:   z.string().min(1, { message: 'Antwort darf nicht leer sein' })
});

const bodyPatchSchema = z.object({
  learningProgress: z.number().optional(),
  isToggled:        z.boolean().optional()
});


function validateParams(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
      const errors = Object.entries(fieldErrors).flatMap(([param, msgs]) =>
        msgs!.map(msg => ({ param, msg }))
      );
      res.status(400).json({ errors });
      return;
    }
    req.params = result.data as any;
    next();
  };
}

function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
      const errors = Object.entries(fieldErrors).flatMap(([param, msgs]) =>
        msgs!.map(msg => ({ param, msg }))
      );
      res.status(400).json({ errors });
      return;             // <- hier ebenfalls
    }
    req.body = result.data;
    next();
  };
}

// Exporte: Middleware-Arrays
export const createFlashcardValidator = [
  validateParams(paramsCreateSchema),
  validateBody(bodyCreateSchema)
];

export const updateFlashcardValidator = [
  validateParams(paramsUpdateSchema)
];

export const patchFlashcardValidator = [
  validateParams(paramsUpdateSchema),
  validateBody(bodyPatchSchema)
];

export const deleteFlashcardValidator = [
  validateParams(z.object({ cardId: z.coerce.number().int().positive() }))
];

// Controller-Funktionen
export async function listFlashcards(req: Request, res: Response): Promise<void> {
  const subtopicId = Number(req.params.subtopicId);
  const cards = await Flashcard.find({ where: { subtopic: { id: subtopicId } } });
  res.json(cards);
}

export async function createFlashcard(req: Request, res: Response): Promise<void> {
  const subtopicId = Number(req.params.subtopicId);
  const { question, answer } = req.body;
  const sub = await Subtopic.findOneBy({ id: subtopicId });
  if (!sub) {
    res.status(404).json({ error: 'Subtopic nicht gefunden.' });
    return;
  }
  const card = Flashcard.create({ question, answer, subtopic: sub });
  await card.save();
  res.status(201).json(card);
}

export async function updateFlashcard(req: Request, res: Response): Promise<void> {
  const cardId = Number(req.params.cardId);
  const { question, answer } = req.body;
  const card = await Flashcard.findOne({ where: { id: cardId }, relations: ['subtopic'] });
  if (!card) {
    res.status(404).json({ error: 'Flashcard nicht gefunden.' });
    return;
  }
  if (question !== undefined) card.question = question;
  if (answer   !== undefined) card.answer   = answer;
  await card.save();
  res.json(card);
}

export async function patchFlashcard(req: Request, res: Response): Promise<void> {
  const cardId = Number(req.params.cardId);
  const { learningProgress, isToggled } = req.body;
  const card = await Flashcard.findOne({ where: { id: cardId }, relations: ['subtopic'] });
  if (!card) {
    res.status(404).json({ error: 'Flashcard nicht gefunden.' });
    return;
  }
  if (learningProgress !== undefined) card.learningProgress = learningProgress;
  if (isToggled        !== undefined) card.isToggled        = isToggled;
  await card.save();
  res.json(card);
}

export async function deleteFlashcard(req: Request, res: Response): Promise<void> {
  const cardId = Number(req.params.cardId);
  const card = await Flashcard.findOneBy({ id: cardId });
  if (!card) {
    res.status(404).json({ error: 'Flashcard nicht gefunden.' });
    return;
  }
  await card.remove();
  res.status(204).end();
}
