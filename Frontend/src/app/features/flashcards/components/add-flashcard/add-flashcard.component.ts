import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlashcardService } from '../../../../flashcard.service';
import { Observable } from 'rxjs';


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
    const newCard = {
      id: Date.now(), // Generate a unique ID based on timestamp
      frontView: this.newFlashcard.frontView,
      backView: this.newFlashcard.backView,
      isToggled: false, // Default value for toggled state
    };
  
    // Use the FlashcardService to save the new flashcard
    this.flashcardService.safeFlashcard(newCard).subscribe(
      (response) => {
        console.log('New flashcard saved:', response);
        alert('Flashcard successfully added!');
        this.newFlashcard = {
          frontView: '',
          backView: '',
        };
      },
      (error) => {
        console.error('Error saving flashcard:', error);
        alert('Failed to add flashcard. Please try again.');
      }
    );
  }
}