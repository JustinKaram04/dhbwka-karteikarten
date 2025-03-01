import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/generalComponents/header/header.component';
import { SidebarComponent } from '../../shared/generalComponents/sidebar/sidebar.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-themengebiete',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './themengebiete.component.html',
  styleUrl: './themengebiete.component.css'
})
export class ThemengebieteComponent {
  themengebietId!: string;
  themengebietName: string = '';
  unterthemen: Observable<String[]>;

  constructor(private route: ActivatedRoute, private service: GetDataService, private router: Router) {}

  ngOnInit() {
    this.themengebietId = String(this.route.snapshot.paramMap.get('id'));

    this.unterthemen.subscribe(data => {
      data[] = this.service.getSubtopics(this.themengebietId);
      console.log(data);
    });
    this.service.getUnterthemen(this.themengebietId).subscribe(data => {
      this.unterthemen = data;
    });
  }

  navigateToUnterthema(unterthemaId: number) {
    console.log('➡️ Navigiere zu Unterthema ID:', unterthemaId);
    this.router.navigate(['/themen', this.themengebietId, unterthemaId]);
  }
}