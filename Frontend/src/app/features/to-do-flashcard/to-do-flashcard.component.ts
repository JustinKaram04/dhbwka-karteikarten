// Standard Angular-Imports für Komponentenerstellung
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Import von eigenem ToDo-Service (enthält Logik und Datenstruktur)
import { ToDoService, Todo } from '../../core/services/toDo/to-do.service'; 

// AuthService, um Login-Status abzufragen
import { AuthService } from '../../core/services/auth/auth.service';

// Deklariert die Komponente und ihre Metadaten
@Component({
  selector: 'app-to-do-flashcard', // HTML-Tag der Komponente
  templateUrl: './to-do-flashcard.component.html', // Template-Pfad
  styleUrls: ['./to-do-flashcard.component.css'], // Styles
  standalone: true, // Wird als Standalone-Komponente verwendet
  imports: [FormsModule, CommonModule], // Notwendige Angular-Module
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
    public authService: AuthService // public, damit im Template nutzbar
  ) {}

  // Beim Laden der Komponente werden vorhandene ToDos geladen
  ngOnInit() {
    this.loadTodos();
  }

  // Lädt die ToDos vom Server
  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: todos => this.todos = todos, // Bei Erfolg: Liste setzen
      error: err => console.error('Fehler beim Laden der Todos', err), // Bei Fehler: Log
    });
  }

  // Öffnet oder schließt das ToDo-Popup
  togglePopup() {
    this.visible = !this.visible;
  }

  // Fügt ein neues ToDo hinzu (wenn das Eingabefeld nicht leer ist)
  addTodo() {
    if (!this.newTodo.trim()) return; // Kein leeres ToDo anlegen
    this.todoService.addTodo(this.newTodo.trim()).subscribe({
      next: todo => {
        this.todos.push(todo); // Neues ToDo zur Liste hinzufügen
        this.newTodo = ''; // Eingabe zurücksetzen
      },
      error: err => console.error('Fehler beim Hinzufügen', err),
    });
  }

  // Wechselt den Status eines ToDos zwischen erledigt und offen
  toggleDone(todo: Todo) {
    this.todoService.toggleDone(todo.id).subscribe({
      next: updated => todo.done = updated.done, // Status im UI aktualisieren
      error: err => console.error('Fehler beim Umschalten', err),
    });
  }

  // Löscht ein ToDo aus der Liste
  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => this.todos = this.todos.filter(t => t.id !== todo.id), // Liste im UI aktualisieren
      error: err => console.error('Fehler beim Löschen', err),
    });
  }
}