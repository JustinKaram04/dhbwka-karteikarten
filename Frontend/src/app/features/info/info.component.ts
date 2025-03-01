import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/generalComponents/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/generalComponents/header/header.component';
@Component({
  selector: 'app-info',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {

}