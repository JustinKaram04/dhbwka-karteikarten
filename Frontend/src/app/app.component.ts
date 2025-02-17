import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FlashcardPreviewComponent } from "./features/flashcard-preview/components/flashcard-preview.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, FlashcardPreviewComponent],
  template: `
  <main>
    <app-flashcard-preview />
  </main>
  `,
  styleUrls: [`./features/flashcard-preview/components/flashcard-preview.component.css`]
})
export class AppComponent {
  title = "TINF24B5";
}
