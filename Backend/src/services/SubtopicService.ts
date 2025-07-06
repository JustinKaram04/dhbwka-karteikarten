import { Subtopic } from '../entity/Subtopic';
import { Topic } from '../entity/Topic';

export class SubtopicService {
  static async list(topicId: number) {
    return Subtopic.find({
      where: { topic: { id: topicId } },
      relations: ['flashcards'],
    });
  }

  static async create(
    topicId: number,
    name: string,
    description?: string
  ) {
    const topic = await Topic.findOneBy({ id: topicId });
    if (!topic) throw { status: 404, message: 'Topic not found' };
    const sub = Subtopic.create({ name, description: description || '', topic });
    await sub.save();
    return sub;
  }

  static async update(
    topicId: number,
    id: number,
    fields: { name?: string; description?: string }
  ) {
    const sub = await Subtopic.findOne({
      where: { id },
      relations: ['topic'],
    });
    if (!sub) throw { status: 404, message: 'Subtopic not found' };
    if (sub.topic.id !== topicId) throw { status: 400, message: 'Mismatch topic' };
    Object.assign(sub, fields);
    await sub.save();
    return sub;
  }

  static async delete(topicId: number, id: number) {
    const sub = await Subtopic.findOne({
      where: { id },
      relations: ['topic'],
    });
    if (!sub) throw { status: 404, message: 'Subtopic not found' };
    if (sub.topic.id !== topicId) throw { status: 400, message: 'Mismatch topic' };
    await sub.remove();
  }
}