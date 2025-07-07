import { Flashcard } from '../entity/Flashcard';// flashcard-entity import um karten aus db zu holen
import { Subtopic } from '../entity/Subtopic';// subtopic-entity import um subtopic zu prüfen

export class FlashcardService {
  // listet alle karten zu nem subtopic
  static async list(subtopicId: number) {
    // findet alle flashcards, die zu subtopic mit id=subtopicId gehören
    return Flashcard.find({ where: { subtopic: { id: subtopicId } } });
  }

  // erstellt ne neue karte unter nem subtopic
  static async create(
    subtopicId: number,
    question: string,
    answer: string
  ) {
    // erst checken ob subtopic existiert
    const sub = await Subtopic.findOneBy({ id: subtopicId });
    if (!sub) throw { status: 404, message: 'Subtopic not found' };
    // neue karte mit question/answer und referenz auf subtopic bauen
    const card = Flashcard.create({ question, answer, subtopic: sub });
    await card.save();// in db speichern
    return card;// erstellte karte zurückgeben
  }

  // updated question/answer einer karte komplett
  static async update(
    subtopicId: number,
    id: number,
    fields: { question?: string; answer?: string }
  ) {
    // karte aus db holen inkl. subtopic-relation
    const card = await Flashcard.findOne({
      where: { id },
      relations: ['subtopic'],
    });
    if (!card) throw { status: 404, message: 'Flashcard not found' };
    // prüfen dass karte auch zum richtigen subtopic gehört
    if (card.subtopic.id !== subtopicId) throw { status: 400, message: 'Mismatch subtopic' };
    // kaskadierend die übergebenen felder einfügen (question/answer)
    Object.assign(card, fields);
    await card.save(); // speichern
    return card;// upgedatete karte zurückgeben
  }

  // ändert nur learningProgress oder isToggled, nicht frage/antwort
  static async patchProgress(
    subtopicId: number,
    id: number,
    fields: { learningProgress?: number; isToggled?: boolean }
  ) {
    // karte holen
    const card = await Flashcard.findOne({
      where: { id },
      relations: ['subtopic'],
    });
    if (!card) throw { status: 404, message: 'Flashcard not found' };
    if (card.subtopic.id !== subtopicId) throw { status: 400, message: 'Mismatch subtopic' };
    //nur fortschritt/toggle-flag updaten
    Object.assign(card, fields);
    await card.save();
    return card; // updated karte
  }

  // löscht ne karte
  static async delete(subtopicId: number, id: number) {
    // karte holen
    const card = await Flashcard.findOne({
      where: { id },
      relations: ['subtopic'],
    });
    if (!card) throw { status: 404, message: 'Flashcard not found' };
    // check subtopic matching
    if (card.subtopic.id !== subtopicId) throw { status: 400, message: 'Mismatch subtopic' };
    await card.remove(); // karte löschen
  }
}
