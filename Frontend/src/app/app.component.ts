import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LoginComponent } from "./features/login/login.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, LoginComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "TINF24B5";
   /**
   *if function login= true/false --> route zu login compon.
   */
}
