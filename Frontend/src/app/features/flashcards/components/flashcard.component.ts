import { Component } from '@angular/core';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.css'
})
export class FlashcardsComponent implements OnInit {
  flashcards: Flashcard[] = [];

  constructor(private CardGenService: CardGenService) {}

  ngOnInit() {
    this.CardGenService.getFlashcards().subscribe((data) => {
      this.flashcards = data; // Daten aus der JSON-Datei laden
      console.log(this.flashcards); // Debugging-Ausgabe
    });
  }
}
