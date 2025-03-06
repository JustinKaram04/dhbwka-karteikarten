import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
@Component({
  selector: 'app-info',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {

}
