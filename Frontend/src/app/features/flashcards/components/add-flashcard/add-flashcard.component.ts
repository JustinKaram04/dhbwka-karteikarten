import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-flashcard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-flashcard.component.html',
  styleUrl: './add-flashcard.component.css'
})
export class AddFlashcardComponent {
  isFormVisible = false; // Controls form visibility
  newFlashcard = {
    frontView: '',
    backView: '',
  };


  constructor(private flashcardService: FlashcardService) {}

  // Toggles form visibility
  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
  }

  // Placeholder for form submission logic
  onSubmit(): void {
    console.log('Flashcard submitted:', this.newFlashcard);
    // Reset form and hide it after submission
    this.newFlashcard = { frontView: '', backView: '' };
    this.isFormVisible = false;
  }
}