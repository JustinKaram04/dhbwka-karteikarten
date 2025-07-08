// Importiert nötige Test-Werkzeuge aus Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importiert die zu testende Komponente
import { ToDoFlashcardComponent } from './to-do-flashcard.component';

// Beschreibt die Test-Suite für die ToDoFlashcard-Komponente
describe('ToDoFlashcardComponent', () => {
  let component: ToDoFlashcardComponent; // Instanz der Komponente
  let fixture: ComponentFixture<ToDoFlashcardComponent>; // Testumgebung mit Zugriff auf Template

  // Vor jedem Test: Testumgebung einrichten
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Komponente als Import – wichtig bei Standalone-Komponenten
      imports: [ToDoFlashcardComponent]
    })
    .compileComponents(); // Kompiliert die Komponente und Abhängigkeiten

    // Erstellt die Testinstanz der Komponente
    fixture = TestBed.createComponent(ToDoFlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Startet Change Detection für initialen Testzustand
  });

  // Ein einfacher Test: Überprüft, ob die Komponente korrekt erzeugt wurde
  it('should create', () => {
    expect(component).toBeTruthy(); // Erwartung: Komponente existiert
  });
});