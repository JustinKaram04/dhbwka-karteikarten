import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFlashcardComponent } from './add-flashcard.component';
import { of } from 'rxjs';

describe('AddFlashcardComponent', () => {
  let component: AddFlashcardComponent;
  let fixture: ComponentFixture<AddFlashcardComponent>;
  let flashcardServiceMock: any;

  beforeEach(async () => {
    flashcardServiceMock = {
      saveFlashcard: jasmine.createSpy('saveFlashcard').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [AddFlashcardComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
