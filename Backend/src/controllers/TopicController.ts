import { Request, Response } from 'express';// express-typen fürs req/res
import { Topic } from '../entity/Topic';// unser topic-entity
import { z, ZodSchema } from 'zod';// zod fürs schema-checken

// schema für params beim update und delete: brauch ne valide topicId
const paramsUpdateSchema = z.object({
  topicId: z.coerce
    .number()// coerce wandelt string -> number
    .int()// muss ganze zahl sein
    .positive({ message: 'Ungültige topicId' })// nur positiv erlaubt
});

// schema fürs body beim erstellen: name min 1, description optional
const bodyCreateSchema = z.object({
  name: z.string().min(1, { message: 'Name darf nicht leer sein' }),
  description: z.string().optional()
});

// schema fürs body beim update: beides optional
const bodyUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional()
});

// helper fürs params-checken
function validateParams(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: any) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      // wenn zod-fehler: flatten, sammle msgs in array
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
      const errors = Object.entries(fieldErrors).flatMap(([param, msgs]) =>
        msgs!.map(msg => ({ param, msg }))
      );
      res.status(400).json({ errors }); // 400 bad request
      return;// abbrechen
    }
    req.params = result.data as any;// gecastete params übernehmen
    next();
  };
}

// helper fürs body-checken
function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: any) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
      const errors = Object.entries(fieldErrors).flatMap(([param, msgs]) =>
        msgs!.map(msg => ({ param, msg }))
      );
      res.status(400).json({ errors }); // wenn body ungültig: fehler
      return;
    }
    req.body = result.data;// validierten body setzen
    next();
  };
}

// export nur die validator-middlewares die du brauchst
export const createTopicValidator = [ validateBody(bodyCreateSchema) ];
export const updateTopicValidator = [
  validateParams(paramsUpdateSchema),
  validateBody(bodyUpdateSchema)
];
export const deleteTopicValidator = [
  validateParams(z.object({ topicId: z.coerce.number().int().positive() }))
];

// controller: alle topics für den eingeloggten user listen
export async function listTopics(req: Request, res: Response): Promise<void> {
  const user = req.user!;// user kommt aus authenticate.ts
  const topics = await Topic.find({
    where: { owner: { id: user.id } },// nur die vom user
    relations: ['subtopics']// gleich subtopics mitladen
  })
  res.json(topics);// json zurück
}

// controller: neues topic erstellen
export async function createTopic(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const { name, description } = req.body;
  const topic = Topic.create({
    name,
    description: description || '',// default leerstring
    owner: user// owner setzen
  });
  await topic.save();// in db speichern
  res.status(201).json(topic);// 201 created
}

// controller: topic updaten
export async function updateTopic(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const topicId = Number(req.params.topicId);
  const { name, description } = req.body;

  const topic = await Topic.findOne({
    where: { id: topicId },
    relations: ['owner']
  });
  if (!topic) {
    res.status(404).json({ error: 'Topic nicht gefunden.' });// if not exist
    return;
  }
  if (topic.owner.id !== user.id) {
    res.status(403).json({ error: 'Zugriff verweigert.' });// nur owner darf
    return;
  }

  if (name !== undefined) topic.name = name;// nur wenn mitgegeben
  if (description !== undefined) topic.description = description;
  await topic.save();// speichern
  res.json(topic);// updated obj zurück
}

// controller: topic löschen
export async function deleteTopic(req: Request, res: Response): Promise<void> {
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

  await topic.remove();// aus db löschen
  res.status(204).end();// 204 no content
}
