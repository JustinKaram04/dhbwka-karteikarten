import { Response, NextFunction } from 'express';
import { todoService } from '../services/TodoService';
import { AuthRequest } from '../middleware/authenticate';

// Holt alle Todos für den aktuell angemeldeten Benutzer
export const getTodos = async (req: AuthRequest, res: Response) => {
  try {
    const todos = await todoService.getTodosByUser(req.user!.id);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

// Fügt ein neues Todo hinzu
export const addTodo = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }
    const todo = await todoService.addTodo(req.user!.id, text);
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
};

// Schaltet den Erledigt-Status eines Todos um
export const toggleTodoDone = async (req: AuthRequest, res: Response) => {
  try {
    const todoId = parseInt(req.params.id, 10);
    const updatedTodo = await todoService.toggleDone(todoId);
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
};

// Löscht ein Todo anhand der ID
export const deleteTodo = async (req: AuthRequest, res: Response) => {
  try {
    const todoId = parseInt(req.params.id, 10);
    await todoService.deleteTodo(todoId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};