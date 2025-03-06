import { Component } from '@angular/core';

@Component({
  selector: 'app-flashcard-preview',
  standalone: true,
  imports: [],
  templateUrl: './flashcard-preview.component.html',
  styleUrl: './flashcard-preview.component.css'
})
export class FlashcardPreviewComponent {
  isFlipped = false;
  leftClicked = false;
  rightClicked = false;

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }

  previousCard() {
    this.leftClicked = true;
    setTimeout(() => this.leftClicked = false, 300);
  }

  nextCard() {
    this.rightClicked = true;
    setTimeout(() => this.rightClicked = false, 300);
  }
}