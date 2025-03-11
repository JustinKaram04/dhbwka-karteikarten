import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-flashcard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-flashcard.component.html',
  styleUrls: ['./add-flashcard.component.css']
})
export class AddFlashcardComponent {
  isFormVisible = false;
  newFlashcard = {
    frontView: '',
    backView: '',
  };

  constructor() {}

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
  }

  onSubmit(): void {
    const newCard = {
      id: Date.now(),
      frontView: this.newFlashcard.frontView,
      backView: this.newFlashcard.backView,
      isToggled: false,
    };
  }
}