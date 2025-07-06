import { Flashcard } from '../entity/Flashcard';
import { Subtopic } from '../entity/Subtopic';

export class FlashcardService {
  static async list(subtopicId: number) {
    return Flashcard.find({ where: { subtopic: { id: subtopicId } } });
  }

  static async create(
    subtopicId: number,
    question: string,
    answer: string
  ) {
    const sub = await Subtopic.findOneBy({ id: subtopicId });
    if (!sub) throw { status: 404, message: 'Subtopic not found' };
    const card = Flashcard.create({ question, answer, subtopic: sub });
    await card.save();
    return card;
  }

  static async update(
    subtopicId: number,
    id: number,
    fields: { question?: string; answer?: string }
  ) {
    const card = await Flashcard.findOne({
      where: { id },
      relations: ['subtopic'],
    });
    if (!card) throw { status: 404, message: 'Flashcard not found' };
    if (card.subtopic.id !== subtopicId) throw { status: 400, message: 'Mismatch subtopic' };
    Object.assign(card, fields);
    await card.save();
    return card;
  }

  static async patchProgress(
    subtopicId: number,
    id: number,
    fields: { learningProgress?: number; isToggled?: boolean }
  ) {
    const card = await Flashcard.findOne({
      where: { id },
      relations: ['subtopic'],
    });
    if (!card) throw { status: 404, message: 'Flashcard not found' };
    if (card.subtopic.id !== subtopicId) throw { status: 400, message: 'Mismatch subtopic' };
    Object.assign(card, fields);
    await card.save();
    return card;
  }

  static async delete(subtopicId: number, id: number) {
    const card = await Flashcard.findOne({
      where: { id },
      relations: ['subtopic'],
    });
    if (!card) throw { status: 404, message: 'Flashcard not found' };
    if (card.subtopic.id !== subtopicId) throw { status: 400, message: 'Mismatch subtopic' };
    await card.remove();
  }
}