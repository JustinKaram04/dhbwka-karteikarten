import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToDoFlashcardComponent } from '../app/features/to-do-flashcard/to-do-flashcard.component';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ToDoFlashcardComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "TINF24B5";
   /**
   *if function login= true/false --> route zu login compon.
   */
}
