import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authenticate';
import { z, ZodSchema } from 'zod';
import { Topic } from '../entity/Topic';

const paramsUpdateSchema = z.object({
  topicId: z.coerce
    .number()
    .int()
    .positive({ message: 'Ungültige topicId' })
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
  return (req: AuthRequest, res: Response, next: NextFunction) => {
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
  return (req: AuthRequest, res: Response, next: NextFunction) => {
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

export const createTopicValidator = [
  validateBody(bodyCreateSchema)
];

export const updateTopicValidator = [
  validateParams(paramsUpdateSchema),
  validateBody(bodyUpdateSchema)
];

export const deleteTopicValidator = [
  validateParams(z.object({ topicId: z.coerce.number().int().positive() }))
];

export async function listTopics(req: AuthRequest, res: Response): Promise<void> {
  const user = req.user!;
  const topics = await Topic.find({
    where: { owner: { id: user.id } },
    relations: ['subtopics']
  });
  res.json(topics);
}

export async function createTopic(req: AuthRequest, res: Response): Promise<void> {
  const user = req.user!;
  const { name, description } = req.body;
  const topic = Topic.create({ name, description: description || '', owner: user });
  await topic.save();
  res.status(201).json(topic);
}

export async function updateTopic(req: AuthRequest, res: Response): Promise<void> {
  const user = req.user!;
  const topicId = Number(req.params.topicId);
  const { name, description } = req.body;
  const topic = await Topic.findOne({
    where: { id: topicId },
    relations: ['owner']
  });
  if (!topic) {
    res.status(404).json({ error: 'Topic nicht gefunden.' });
    return;
  }
  if (topic.owner.id !== user.id) {
    res.status(403).json({ error: 'Zugriff verweigert.' });
    return;
  }
  if (name !== undefined) topic.name = name;
  if (description !== undefined) topic.description = description;
  await topic.save();
  res.json(topic);
}

export async function deleteTopic(req: AuthRequest, res: Response): Promise<void> {
  const user = req.user!;
  const topicId = Number(req.params.topicId);
  const topic = await Topic.findOne({
    where: { id: topicId },
    relations: ['owner']
  });
  if (!topic) {
    res.status(404).json({ error: 'Topic nicht gefunden.' });
    return;
  }
  if (topic.owner.id !== user.id) {
    res.status(403).json({ error: 'Zugriff verweigert.' });
    return;
  }
  await topic.remove();
  res.status(204).end();
}
