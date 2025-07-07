import { Router } from 'express';// express router holen
import { authenticate } from '../middleware/authenticate'; // auth middleware, checkt token

import {
  listTopics,
  createTopic,
  createTopicValidator,
  updateTopic,
  updateTopicValidator,
  deleteTopic,
  deleteTopicValidator// neu importiert brauchts fürs delete
} from '../controllers/TopicController';

import {
  listSubtopics,
  createSubtopic,
  createSubtopicValidator,
  updateSubtopic,
  updateSubtopicValidator,
  deleteSubtopic,
  deleteSubtopicValidator
} from '../controllers/SubtopicController';

import {
  listFlashcards,
  createFlashcard,
  createFlashcardValidator,
  updateFlashcard,
  updateFlashcardValidator,
  patchFlashcard,
  patchFlashcardValidator,
  deleteFlashcard,
  deleteFlashcardValidator
} from '../controllers/FlashcardController';

const router = Router(); // router-instanz anlegen

router.use(authenticate); // alle routes müssen erst auth durchlaufen

// GET  alle topics vom user holen
router.get('/', listTopics);

// POST neues topic anlegen, vorher validator durchlaufen
router.post('/', ...createTopicValidator, createTopic);

// PUT /:topicId topic updaten (name/description), brauchst topicId und body-validator
router.put('/:topicId', ...updateTopicValidator, updateTopic);

// DELETE /:topicId topic löschen, nur owner darf validator checkt params
router.delete('/:topicId', ...deleteTopicValidator, deleteTopic);

// GET /:topicId/subtopics alle subtopics zu nem topic abfragen
router.get('/:topicId/subtopics', listSubtopics);

// POST /:topicId/subtopics neues subtopic anlegen unter topi validator für params+body
router.post('/:topicId/subtopics', ...createSubtopicValidator, createSubtopic);

// PUT /:topicId/subtopics/:subtopicId subtopic updaten beide ids im params
router.put(
  '/:topicId/subtopics/:subtopicId',
  ...updateSubtopicValidator,
  updateSubtopic
);

// DELETE /:topicId/subtopics/:subtopicId subtopic löschen validator checkt subtopicId
router.delete(
  '/:topicId/subtopics/:subtopicId',
  ...deleteSubtopicValidator,
  deleteSubtopic
);

// GET /:topicId/subtopics/:subtopicId/flashcards karten für subtopic listen
router.get(
  '/:topicId/subtopics/:subtopicId/flashcards',
  listFlashcards
);

// POST /:topicId/subtopics/:subtopicId/flashcards neue flashcard erstellen
router.post(
  '/:topicId/subtopics/:subtopicId/flashcards',
  ...createFlashcardValidator,
  createFlashcard
);

// PUT /:topicId/subtopics/:subtopicId/flashcards/:cardId ganze karte updaten (question/answer)
router.put(
  '/:topicId/subtopics/:subtopicId/flashcards/:cardId',
  ...updateFlashcardValidator,
  updateFlashcard
);

// PATCH /:topicId/subtopics/:subtopicId/flashcards/:cardId teil-update (learningProgress/isToggled)
router.patch(
  '/:topicId/subtopics/:subtopicId/flashcards/:cardId',
  ...patchFlashcardValidator,
  patchFlashcard
);

// DELETE /:topicId/subtopics/:subtopicId/flashcards/:cardId karte löschen
router.delete(
  '/:topicId/subtopics/:subtopicId/flashcards/:cardId',
  ...deleteFlashcardValidator,
  deleteFlashcard
);

export default router; //router exportieren wird in app.ts eingebunden
