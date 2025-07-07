import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToDoService, Todo } from '../../core/services/toDo/to-do.service';  // Pfad anpassen!

@Component({
  selector: 'app-to-do-flashcard',
  templateUrl: './to-do-flashcard.component.html',
  styleUrls: ['./to-do-flashcard.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],  // HttpClientModule hier NICHT importieren!
})
export class ToDoFlashcardComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: string = '';
  visible: boolean = false;

  constructor(private todoService: ToDoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: todos => this.todos = todos,
      error: err => console.error('Fehler beim Laden der Todos', err),
    });
  }

  togglePopup() {
    this.visible = !this.visible;
  }

  addTodo() {
    if (!this.newTodo.trim()) return;
    this.todoService.addTodo(this.newTodo.trim()).subscribe({
      next: todo => {
        this.todos.push(todo);
        this.newTodo = '';
      },
      error: err => console.error('Fehler beim Hinzufügen', err),
    });
  }

  toggleDone(todo: Todo) {
    this.todoService.toggleDone(todo.id).subscribe({
      next: updated => todo.done = updated.done,
      error: err => console.error('Fehler beim Umschalten', err),
    });
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => this.todos = this.todos.filter(t => t.id !== todo.id),
      error: err => console.error('Fehler beim Löschen', err),
    });
  }
}