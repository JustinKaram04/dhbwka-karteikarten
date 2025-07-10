import { AppDataSource } from '../ormconfig';
import { Todo } from '../entity/Todo';

export const todoService = {
  // Gibt alle Todos eines bestimmten Benutzers zurück
  async getTodosByUser(userId: number) {
    const todoRepository = AppDataSource.getRepository(Todo);
    return todoRepository.find({ where: { user: { id: userId } } });
  },

  // Erstellt ein neues Todo für einen Benutzer
  async addTodo(userId: number, text: string) {
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = todoRepository.create({ text, user: { id: userId } });
    return todoRepository.save(todo);
  },

  // Schaltet den "done"-Status eines Todos um
  async toggleDone(todoId: number) {
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.findOneBy({ id: todoId });
    if (!todo) throw new Error('Todo not found');
    todo.done = !todo.done;
    return todoRepository.save(todo);
  },

  // Löscht ein Todo anhand der ID
  async deleteTodo(todoId: number) {
    const todoRepository = AppDataSource.getRepository(Todo);
    return todoRepository.delete(todoId);
  }
};