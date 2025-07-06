import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoFlashcardComponent } from './to-do-flashcard.component';

describe('ToDoFlashcardComponent', () => {
  let component: ToDoFlashcardComponent;
  let fixture: ComponentFixture<ToDoFlashcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoFlashcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToDoFlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
