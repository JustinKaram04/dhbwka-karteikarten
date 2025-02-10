import { Component } from '@angular/core';
import { LoginComponent } from '../../features/auth/login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [LoginComponent, Router],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent {

}
