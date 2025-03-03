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
import { ISubtopic } from '../../core/models/isubtopic';

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
  unterthemen$: Observable<ISubtopic[]> = of([]);
  currentTopic$: Observable<ITopic | undefined> = of(undefined);

  constructor(private route: ActivatedRoute, private service: GetDataService, private router: Router) {}

  ngOnInit() {
    this.currentTopic$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.themengebietId = id;
          return this.service.getSingleTopic(id);
        } else {
          console.error('No ID provided in route');
          return of(undefined);
        }
    
      }),
      tap(topic => {
        console.log('Received topic:', topic); // Debug log
        if (topic) {
          this.themengebietName = topic.name;
          this.unterthemen$ = of(topic.subtopics);
          console.log('Subtopics:', topic.subtopics); // Debug log
        } else {
          console.error('Topic not found');
          // Handle the case when topic is not found (e.g., navigate to error page)
        }
      })
    );
    console.log(this.themengebietId);
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
  } 
    
      this.themengebietId = String(params.get('id'));
        return this.service.getSingleTopic(this.themengebietId);
  */