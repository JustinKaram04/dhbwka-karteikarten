import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthComponent } from "./features/flashcards/auth/components/auth.component";
import { LoginComponent } from "./features/auth/login/login.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, AuthComponent, LoginComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "TINF24B5";
}
