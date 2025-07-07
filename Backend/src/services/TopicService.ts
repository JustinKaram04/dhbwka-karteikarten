import { Topic } from '../entity/Topic';// topic-entity fürs db-model
import { Subtopic } from '../entity/Subtopic';// subtopic-entity, wird hier zwar importiert, aber nicht direkt genutzt
import { Flashcard } from '../entity/Flashcard';// flashcard-entity, dito
import { User } from '../entity/User';// user-entity, um owner zu repräsentieren

export class TopicService {
  // holt alle topics vom user, lädt gleich subtopics mit
  static async list(user: User) {
    return Topic.find({
      where: { owner: { id: user.id } },
      relations: ['subtopics'], // join subtopics
    });
  }

  // erstellt neues topic für den user
  static async create(
    user: User,
    name: string,
    description?: string
  ) {
    //baue topic-entitydefault description leerstring wenn nix mitgegeben
    const topic = Topic.create({ name, description: description || '', owner: user });
    await topic.save(); // speicher in der db
    return topic;       // gib das neue topic zurück
  }

  // updated name/description von nem topic nur wenn user owner ist
  static async update(
    user: User,
    id: number,
    fields: { name?: string; description?: string }
  ) {
    // find topic inkl. owner-relation
    const topic = await Topic.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!topic) throw { status: 404, message: 'Topic not found' };// 404 wenn nicht gefunden
    if (topic.owner.id !== user.id) throw { status: 403, message: 'Forbidden' }; // 403 wenn nicht owner

    Object.assign(topic, fields); // merge nur die übergebenen felder rein
    await topic.save();// speichern
    return topic;// gib das updated topic zurück
  }

  // löscht ein topic, nur owner darf
  static async delete(user: User, id: number) {
    // find topic inkl. owner
    const topic = await Topic.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!topic) throw { status: 404, message: 'Topic not found' };      // 404 wenn nicht da
    if (topic.owner.id !== user.id) throw { status: 403, message: 'Forbidden' }; // 403 wenn nicht owner

    await topic.remove(); // aus der db löschen
  }
}
