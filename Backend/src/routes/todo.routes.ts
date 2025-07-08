import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { getTodos, addTodo, toggleTodoDone, deleteTodo } from '../controllers/TodoController';

const router = Router();

router.use(authenticate); 

router.get('/', getTodos);
router.post('/', addTodo);
router.patch('/:id/toggle', toggleTodoDone);
router.delete('/:id', deleteTodo);

export default router;