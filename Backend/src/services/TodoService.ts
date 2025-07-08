import { AppDataSource } from '../ormconfig';
import { Todo } from '../entity/Todo';

export const todoService = {
  async getTodosByUser(userId: number) {
    const todoRepository = AppDataSource.getRepository(Todo);
    return todoRepository.find({ where: { user: { id: userId } } });
  },

  async addTodo(userId: number, text: string) {
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = todoRepository.create({ text, user: { id: userId } });
    return todoRepository.save(todo);
  },

  async toggleDone(todoId: number) {
    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.findOneBy({ id: todoId });
    if (!todo) throw new Error('Todo not found');
    todo.done = !todo.done;
    return todoRepository.save(todo);
  },

  async deleteTodo(todoId: number) {
    const todoRepository = AppDataSource.getRepository(Todo);
    return todoRepository.delete(todoId);
  }
};