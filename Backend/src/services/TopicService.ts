import { Topic } from '../entity/Topic';
import { Subtopic } from '../entity/Subtopic';
import { Flashcard } from '../entity/Flashcard';
import { User } from '../entity/User';

export class TopicService {
  static async list(user: User) {
    return Topic.find({
      where: { owner: { id: user.id } },
      relations: ['subtopics'],
    });
  }

  static async create(
    user: User,
    name: string,
    description?: string
  ) {
    const topic = Topic.create({ name, description: description || '', owner: user });
    await topic.save();
    return topic;
  }

  static async update(
    user: User,
    id: number,
    fields: { name?: string; description?: string }
  ) {
    const topic = await Topic.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!topic) throw { status: 404, message: 'Topic not found' };
    if (topic.owner.id !== user.id) throw { status: 403, message: 'Forbidden' };
    Object.assign(topic, fields);
    await topic.save();
    return topic;
  }

  static async delete(user: User, id: number) {
    const topic = await Topic.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!topic) throw { status: 404, message: 'Topic not found' };
    if (topic.owner.id !== user.id) throw { status: 403, message: 'Forbidden' };
    await topic.remove();
  }
}