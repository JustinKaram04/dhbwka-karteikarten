import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/generalComponents/header/header.component';
import { SidebarComponent } from '../../shared/generalComponents/sidebar/sidebar.component';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { OnInit } from '@angular/core';
import { ITopic } from '../../core/models/itopic';

@Component({
  selector: 'app-themengebiete',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './themengebiete.component.html',
  styleUrl: './themengebiete.component.css'
})
export class ThemengebieteComponent implements OnInit{
  themengebietId!: string;
  themengebietName: string = '';
  unterthemen$: Observable<string[]> = of([]);
  currentTopic$: Observable<ITopic | undefined> = of(undefined);

  constructor(private route: ActivatedRoute, private service: GetDataService, private router: Router) {}

  ngOnInit() {
    this.currentTopic$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.themengebietId = String(params.get('id'));
        return this.service.getSingleTopic(this.themengebietId);
      }),
      tap(topic => {
        if (topic) {
          this.themengebietName = topic.name;
          this.unterthemen$ = of(topic.subtopics.map(sub => sub.name));
        } else {
          console.error('Topic not found');
          // Handle the case when topic is not found (e.g., navigate to error page)
        }
      })
    );
  }

  navigateToUnterthema(unterthemaId: string) {
    console.log('➡️ Navigiere zu Unterthema ID:', unterthemaId);
    this.router.navigate(['/themen', this.themengebietId, unterthemaId]);
  }
}



/*   ngOnInit() {
    this.themengebietId = String(this.route.snapshot.paramMap.get('id'));

    this.service.getSingleTopic(this.themengebietId).subscribe(topic => {
     
    });
    this.unterthemen = this.service.getSubtopics(this.themengebietId);
    };
  } */