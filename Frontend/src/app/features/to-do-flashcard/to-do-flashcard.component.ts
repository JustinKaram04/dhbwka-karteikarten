import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToDoService, Todo } from '../../core/services/toDo/to-do.service'; 
import { AuthService } from '../../core/services/auth/auth.service';

// Deklariert die Komponente und ihre Metadaten
@Component({
  selector: 'app-to-do-flashcard', 
  templateUrl: './to-do-flashcard.component.html',
  styleUrls: ['./to-do-flashcard.component.css'], 
  standalone: true, 
  imports: [FormsModule, CommonModule],
})
export class ToDoFlashcardComponent implements OnInit {
  // Liste aller ToDos
  todos: Todo[] = [];

  // Input-Feld für neues ToDo
  newTodo: string = '';

  // Sichtbarkeit des ToDo-Popups
  visible: boolean = false;

  // Konstruktor bekommt den ToDo-Service und den AuthService
  constructor(
    private todoService: ToDoService,
    public authService: AuthService
  ) {}

  // Beim Laden der Komponente werden vorhandene ToDos geladen
  ngOnInit() {
    this.loadTodos();
  }

  // Lädt die ToDos vom Server
  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: todos => this.todos = todos,
      error: err => console.error('Fehler beim Laden der Todos', err),
    });
  }

  // Öffnet oder schließt das ToDo-Popup
  togglePopup() {
    this.visible = !this.visible;
  }

  // Fügt ein neues ToDo hinzu (wenn das Eingabefeld nicht leer ist)
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

  // Wechselt den Status eines ToDos zwischen erledigt und offen
  toggleDone(todo: Todo) {
    this.todoService.toggleDone(todo.id).subscribe({
      next: updated => todo.done = updated.done, 
      error: err => console.error('Fehler beim Umschalten', err),
    });
  }

  // Löscht ein ToDo aus der Liste
  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => this.todos = this.todos.filter(t => t.id !== todo.id),
      error: err => console.error('Fehler beim Löschen', err),
    });
  }
}