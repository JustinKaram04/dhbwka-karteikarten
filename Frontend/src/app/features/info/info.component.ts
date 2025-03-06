import { Component } from '@angular/core';
<<<<<<< HEAD
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from "../../shared/components/header/header.component";
=======
import { SidebarComponent } from '../../shared/generalComponents/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/generalComponents/header/header.component';
>>>>>>> main
@Component({
  selector: 'app-info',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {

<<<<<<< HEAD
}
=======
}
>>>>>>> main
