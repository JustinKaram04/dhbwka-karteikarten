import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.css'
})
export class FlashcardComponent {
  // properties

  @Input() frontView!: string;
  @Input() backView!: string;
  @Input() isToggled: boolean = false;

  toggleFlip(): void {
    this.isToggled = !this.isToggled;
  }
}