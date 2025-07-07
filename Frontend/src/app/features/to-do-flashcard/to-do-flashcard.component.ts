import { Component } from '@angular/core';

@Component({
  selector: 'app-todo-modal',
  templateUrl: './todo-modal.component.html',
  styleUrls: ['./todo-modal.component.scss']
})
export class ToDoFlashcardComponent {
  showModal = false;
  newTodo = '';
  todos: string[] = [];

  toggleModal(): void {
    this.showModal = !this.showModal;
  }

  addTodo(): void {
    const trimmed = this.newTodo.trim();
    if (trimmed) {
      this.todos.push(trimmed);
      this.newTodo = '';
    }
  }

  deleteTodo(index: number): void {
    this.todos.splice(index, 1);
  }
}
