import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { Flashcard } from '../entity/Flashcard';
import { Subtopic } from '../entity/Subtopic';

//schema für params beim anlegen brauchen die subtopicid als positive zahl
const paramsCreateSchema = z.object({
  subtopicId: z.coerce
    .number()
    .int()
    .positive({ message: 'Ungültige subtopicId' })
});

//schema für params beim updatesubtopiciud und cardid müssen stimmen
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

//chema für body beim anlegen: frage und antwort dürfen nicht leer sein
const bodyCreateSchema = z.object({
  question: z.string().min(1, { message: 'Frage darf nicht leer sein' }),
  answer:   z.string().min(1, { message: 'Antwort darf nicht leer sein' })
});

// schema für patch: nur fields die geändert werden sollen, optional
const bodyPatchSchema = z.object({
  learningProgress: z.number().optional(),
  isToggled:        z.boolean().optional()
});

// helper für params validation
function validateParams(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      // bei fehler: alle messages sammeln
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
      const errors = Object.entries(fieldErrors).flatMap(([param, msgs]) =>
        msgs!.map(msg => ({ param, msg }))
      );
      res.status(400).json({ errors });
      return;
    }
    req.params = result.data as any; //gecastet
    next();
  };
}

//helper für body validation (fast gleich wie oben)
function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
      const errors = Object.entries(fieldErrors).flatMap(([param, msgs]) =>
        msgs!.map(msg => ({ param, msg }))
      );
      res.status(400).json({ errors });
      return;
    }
    req.body = result.data; //nur validierte daten
    next();
  };
}

//jetzt exportieren wir arrays mit middlewares zum router einhängen
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

//controller funktionen

export async function listFlashcards(req: Request, res: Response): Promise<void> {
  const subtopicId = Number(req.params.subtopicId); // id aus params
  const cards = await Flashcard.find({ where: { subtopic: { id: subtopicId } } });
  res.json(cards); // alle karten der subtopic zurück
}

export async function createFlashcard(req: Request, res: Response): Promise<void> {
  const subtopicId = Number(req.params.subtopicId);
  const { question, answer } = req.body; // aus validated body
  const sub = await Subtopic.findOneBy({ id: subtopicId });
  if (!sub) {
    res.status(404).json({ error: 'Subtopic nicht gefunden.' });
    return;
  }
  const card = Flashcard.create({ question, answer, subtopic: sub });
  await card.save(); // abspeichern
  res.status(201).json(card); // neue karte zurück
}

export async function updateFlashcard(req: Request, res: Response): Promise<void> {
  const cardId = Number(req.params.cardId);
  const { question, answer } = req.body;
  const card = await Flashcard.findOne({ where: { id: cardId }, relations: ['subtopic'] });
  if (!card) {
    res.status(404).json({ error: 'Flashcard nicht gefunden.' });
    return;
  }
  if (question !== undefined) card.question = question; //nur wenn gesetzt
  if (answer   !== undefined) card.answer   = answer;
  await card.save();
  res.json(card); //geänderte karte
}

export async function patchFlashcard(req: Request, res: Response): Promise<void> {
  const cardId = Number(req.params.cardId);
  const { learningProgress, isToggled } = req.body;
  const card = await Flashcard.findOne({ where: { id: cardId }, relations: ['subtopic'] });
  if (!card) {
    res.status(404).json({ error: 'Flashcard nicht gefunden.' });
    return;
  }
  if (learningProgress !== undefined) card.learningProgress = learningProgress; //update progress
  if (isToggled        !== undefined) card.isToggled        = isToggled; //update togle
  await card.save();
  res.json(card); //updated karte
}

export async function deleteFlashcard(req: Request, res: Response): Promise<void> {
  const cardId = Number(req.params.cardId);
  const card = await Flashcard.findOneBy({ id: cardId });
  if (!card) {
    res.status(404).json({ error: 'Flashcard nicht gefunden.' });
    return;
  }
  await card.remove(); // löschen aus db
  res.status(204).end(); // kein content
}