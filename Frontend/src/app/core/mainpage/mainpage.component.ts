import { Component } from '@angular/core';
import { LoginComponent } from '../../features/login/login.component';


@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent {

}
