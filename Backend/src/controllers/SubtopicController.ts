import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { Subtopic } from '../entity/Subtopic';
import { Topic } from '../entity/Topic';

const paramsCreateSchema = z.object({
  topicId: z.coerce
    .number()
    .int()
    .positive({ message: 'Ungültige topicId' })
});

const paramsUpdateSchema = z.object({
  topicId: z.coerce
    .number()
    .int()
    .positive({ message: 'Ungültige topicId' }),
  subtopicId: z.coerce
    .number()
    .int()
    .positive({ message: 'Ungültige subtopicId' })
});

const bodyCreateSchema = z.object({
  name: z.string().min(1, { message: 'Name darf nicht leer sein' }),
  description: z.string().optional()
});

const bodyUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional()
});

function validateParams(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
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
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
      const errors = Object.entries(fieldErrors).flatMap(([param, msgs]) =>
        msgs!.map(msg => ({ param, msg }))
      );
      res.status(400).json({ errors });
      return;
    }
    req.body = result.data;
    next();
  };
}

export const createSubtopicValidator = [
  validateParams(paramsCreateSchema),
  validateBody(bodyCreateSchema)
];

export const updateSubtopicValidator = [
  validateParams(paramsUpdateSchema),
  validateBody(bodyUpdateSchema)
];

export const deleteSubtopicValidator = [
  validateParams(z.object({ subtopicId: z.coerce.number().int().positive() }))
];

export async function listSubtopics(req: Request, res: Response): Promise<void> {
  const topicId = Number(req.params.topicId);
  const subs = await Subtopic.find({
    where: { topic: { id: topicId } },
    relations: ['flashcards']
  });
  res.json(subs);
}

export async function createSubtopic(req: Request, res: Response): Promise<void> {
  const topicId = Number(req.params.topicId);
  const { name, description } = req.body;
  const topic = await Topic.findOneBy({ id: topicId });
  if (!topic) {
    res.status(404).json({ error: 'Topic nicht gefunden.' });
    return;
  }
  const sub = Subtopic.create({ name, description: description || '', topic });
  await sub.save();
  res.status(201).json(sub);
}

export async function updateSubtopic(req: Request, res: Response): Promise<void> {
  const topicId = Number(req.params.topicId);
  const subId = Number(req.params.subtopicId);
  const { name, description } = req.body;
  const sub = await Subtopic.findOne({
    where: { id: subId },
    relations: ['topic']
  });
  if (!sub || sub.topic.id !== topicId) {
    res.status(404).json({ error: 'Subtopic nicht gefunden für dieses Topic.' });
    return;
  }
  if (name !== undefined) sub.name = name;
  if (description !== undefined) sub.description = description;
  await sub.save();
  res.json(sub);
}

export async function deleteSubtopic(req: Request, res: Response): Promise<void> {
  const subId = Number(req.params.subtopicId);
  const sub = await Subtopic.findOne({
    where: { id: subId },
    relations: ['topic']
  });
  if (!sub) {
    res.status(404).json({ error: 'Subtopic nicht gefunden.' });
    return;
  }
  await sub.remove();
  res.status(204).end();
}