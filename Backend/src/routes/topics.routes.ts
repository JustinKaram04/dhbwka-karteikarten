import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';

import {
  listTopics,
  createTopic,
  createTopicValidator,
  updateTopic,
  updateTopicValidator,
  deleteTopic
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

const router = Router();

router.use(authenticate);

// Topics routes
router.get('/', listTopics);
router.post('/',               ...createTopicValidator,   createTopic);
router.put('/:topicId',        ...updateTopicValidator,   updateTopic);
router.delete('/:topicId',     ...updateTopicValidator,   deleteTopic);

// Subtopics routes
router.get('/:topicId/subtopics',                         listSubtopics);
router.post('/:topicId/subtopics',    ...createSubtopicValidator, createSubtopic);
router.put('/:topicId/subtopics/:subtopicId', ...updateSubtopicValidator, updateSubtopic);
router.delete('/:topicId/subtopics/:subtopicId', ...deleteSubtopicValidator, deleteSubtopic);

// Flashcards routes
router.get('/:topicId/subtopics/:subtopicId/flashcards',                         listFlashcards);
router.post('/:topicId/subtopics/:subtopicId/flashcards', ...createFlashcardValidator,  createFlashcard);
router.put('/:topicId/subtopics/:subtopicId/flashcards/:cardId', ...updateFlashcardValidator, updateFlashcard);
router.patch('/:topicId/subtopics/:subtopicId/flashcards/:cardId', ...patchFlashcardValidator,  patchFlashcard);
router.delete('/:topicId/subtopics/:subtopicId/flashcards/:cardId', ...deleteFlashcardValidator, deleteFlashcard);

export default router;