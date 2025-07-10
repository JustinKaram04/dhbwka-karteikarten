import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToDoFlashcardComponent } from './to-do-flashcard.component';

// Beschreibt die Test-Suite für die ToDoFlashcard-Komponente
describe('ToDoFlashcardComponent', () => {
  let component: ToDoFlashcardComponent; 
  let fixture: ComponentFixture<ToDoFlashcardComponent>; 

  // Vor jedem Test: Testumgebung einrichten
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      imports: [ToDoFlashcardComponent]
    })
    .compileComponents(); 

    // Erstellt die Testinstanz der Komponente
    fixture = TestBed.createComponent(ToDoFlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  // Ein einfacher Test: Überprüft, ob die Komponente korrekt erzeugt wurde
  it('should create', () => {
    expect(component).toBeTruthy(); 
  });
});