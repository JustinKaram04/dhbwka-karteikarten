import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { Subtopic } from '../entity/Subtopic';
import { Topic } from '../entity/Topic';

// schema für params beim erstellen: brauch topicId als positive zahl
const paramsCreateSchema = z.object({
  topicId: z.coerce
    .number()
    .int()
    .positive({ message: 'Ungültige topicId' })
});

// schema für params beim update: topicId und subtopicId müssen valide sein
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

// schema für body beim erstellen: name darf nicht leer sein, description optional
const bodyCreateSchema = z.object({
  name: z.string().min(1, { message: 'Name darf nicht leer sein' }),
  description: z.string().optional()
});

// schema für body beim update: name und description optional
const bodyUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional()
});

// helper fürs params-checken, kriegt schema rein und validiert req.params
function validateParams(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      // sammle alle fehler messages aus dem zod-error
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
      const errors = Object.entries(fieldErrors).flatMap(([param, msgs]) =>
        msgs!.map(msg => ({ param, msg }))
      );
      res.status(400).json({ errors }); // 400 = bad request
      return; // stopp hier
    }
    // alles gut, überschreib params mit den gecasteten werten
    req.params = result.data as any;
    next();
  };
}

// helper fürs body-checken, gleiches prinzip wie oben
function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
      const errors = Object.entries(fieldErrors).flatMap(([param, msgs]) =>
        msgs!.map(msg => ({ param, msg }))
      );
      res.status(400).json({ errors }); // wenn body ungültig: fehler zurück
      return;
    }
    // validierter body wird gesetzt
    req.body = result.data;
    next();
  };
}

// export für router: middleware-stapel
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

// controller: liste alle subtopics zu nem topic
export async function listSubtopics(req: Request, res: Response): Promise<void> {
  const topicId = Number(req.params.topicId); // sicherheitshalber casten
  const subs = await Subtopic.find({
    where: { topic: { id: topicId } },
    relations: ['flashcards'] // gleich die zugehörigen karten mitladen
  });
  res.json(subs); // schick array zurück
}

// controller: neues subtopic erstellen
export async function createSubtopic(req: Request, res: Response): Promise<void> {
  const topicId = Number(req.params.topicId);
  const { name, description } = req.body;
  const topic = await Topic.findOneBy({ id: topicId });
  if (!topic) {
    // wenn das topic nicht existiert
    res.status(404).json({ error: 'Topic nicht gefunden.' });
    return;
  }
  // description default '' falls undefined
  const sub = Subtopic.create({ name, description: description || '', topic });
  await sub.save(); // in db speichern
  res.status(201).json(sub); // 201 = created
}

// controller: subtopic updaten
export async function updateSubtopic(req: Request, res: Response): Promise<void> {
  const topicId = Number(req.params.topicId);
  const subId = Number(req.params.subtopicId);
  const { name, description } = req.body;
  const sub = await Subtopic.findOne({
    where: { id: subId },
    relations: ['topic']
  });
  // geprüft ob sub existiert und zum richtigen topic gehört
  if (!sub || sub.topic.id !== topicId) {
    res.status(404).json({ error: 'Subtopic nicht gefunden für dieses Topic.' });
    return;
  }
  // nur update wenn feld angegeben wurde
  if (name !== undefined) sub.name = name;
  if (description !== undefined) sub.description = description;
  await sub.save(); // speichern
  res.json(sub); // geändertes subtopic zurück
}

// controller: subtopic löschen
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
  await sub.remove(); // aus db löschen
  res.status(204).end(); // 204 = no content
}
