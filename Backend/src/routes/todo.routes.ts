import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { getTodos, addTodo, toggleTodoDone, deleteTodo } from '../controllers/TodoController';

const router = Router();

// Middleware, die alle nachfolgenden Routen schützt (nur authentifizierte Benutzer)
router.use(authenticate); 

// Route zum Abrufen aller Todos des aktuellen Benutzers
router.get('/', getTodos);

// Route zum Hinzufügen eines neuen Todos
router.post('/', addTodo);

// Route zum Umschalten des "done"-Status eines Todos anhand der ID
router.patch('/:id/toggle', toggleTodoDone);

// Route zum Löschen eines Todos anhand der ID
router.delete('/:id', deleteTodo);

export default router;