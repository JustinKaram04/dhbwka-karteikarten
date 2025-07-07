import { Subtopic } from '../entity/Subtopic'; // subtopic-entity import, um mit db zu quatschen
import { Topic } from '../entity/Topic';// topic-entity import, um topic zu checken

export class SubtopicService {
  // alle subtopics zu nem topic holen
  static async list(topicId: number) {
    // hier laden wir subtopics filtern nach topic-id und laden gleich die flashcards mit
    return Subtopic.find({
      where: { topic: { id: topicId } },
      relations: ['flashcards'],
    });
  }

  // neues subtopic unter nem topic erstellen
  static async create(
    topicId: number,
    name: string,
    description?: string
  ) {
    // erst checken ob das topic überhaupt existiert
    const topic = await Topic.findOneBy({ id: topicId });
    if (!topic) throw { status: 404, message: 'Topic not found' };

    //subtopic bauen default description leer string falls nix mitgegeben
    const sub = Subtopic.create({ name, description: description || '', topic });
    await sub.save(); // speichern in der db
    return sub;// neue subtopic zurückgeben
  }

  // subtopic updaten (name oder description ändern)
  static async update(
    topicId: number,
    id: number,
    fields: { name?: string; description?: string }
  ) {
    //karte holen inkl. topic relation, um ownership zu checken
    const sub = await Subtopic.findOne({
      where: { id },
      relations: ['topic'],
    });
    if (!sub) throw { status: 404, message: 'Subtopic not found' };
    // prüfen, dass das subtopic wirklich zum richtigen topic gehört
    if (sub.topic.id !== topicId) throw { status: 400, message: 'Mismatch topic' };

    //übergebene felder ins object mergen
    Object.assign(sub, fields);
    await sub.save(); // speichern
    return sub;// updated subtopic zurück
  }

  // subtopic löschen
  static async delete(topicId: number, id: number) {
    // sub holen inkl. topic relation
    const sub = await Subtopic.findOne({
      where: { id },
      relations: ['topic'],
    });
    if (!sub) throw { status: 404, message: 'Subtopic not found' };
    if (sub.topic.id !== topicId) throw { status: 400, message: 'Mismatch topic' };

    await sub.remove(); // lösche das subtopic aus der db
  }
}
