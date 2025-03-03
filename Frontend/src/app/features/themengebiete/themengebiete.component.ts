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
import { find } from 'rxjs/operators';

@Component({
  selector: 'app-themengebiete',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './themengebiete.component.html',
  styleUrl: './themengebiete.component.css'
})
export class ThemengebieteComponent implements OnInit{
  themengebietId: string = '';
  themengebietName: string = '';
  unterthemen: ISubtopic[] = [];
  currentTopic: ITopic | undefined;
  TopicList: ITopic[] = [];

  constructor(private route: ActivatedRoute, private service: GetDataService, private router: Router) {}

  ngOnInit() {
    this.themengebietId = String(this.route.snapshot.paramMap.get('id'));
    console.log (this.themengebietId)
    this.service.getTopics().subscribe(
      topics => {
        this.TopicList = topics; // Assign the fetched topics to the array
        console.log('Fetched topics:', this.TopicList); // Debug log
        this.findCurrentTopic();
      },
      error => {
        console.error('Error fetching topics:', error); // Handle errors
      }
    );
    
  }

  findCurrentTopic() {
    this.currentTopic = this.TopicList.find(topic => topic.id === this.themengebietId);
    if (this.currentTopic) {
      console.log('Found topic:', this.currentTopic);
      this.themengebietName = this.currentTopic.name;
      this.unterthemen = this.currentTopic.subtopics || []; // Assign subtopics to unterthemen
      console.log('Unterthemen:', this.unterthemen); // Debug log
    } else {
      console.log('Topic not found');
    }
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
      }),
  */