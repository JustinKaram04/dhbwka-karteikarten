import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { Observable } from 'rxjs';
import { ISubtopic } from '../../core/models/isubtopic';
import { ITopic } from '../../core/models/itopic';

@Component({
  selector: 'app-themengebiete',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterOutlet],
  templateUrl: './themengebiete.component.html',
  styleUrl: './themengebiete.component.css'
})
export class ThemengebieteComponent {
  topicId!: string;
  themengebietName: string = '';
  unterthemen$: Observable<ISubtopic[]> | null = null;
  activeMenuId: string | null = null;
  hoveredId: string | null = null;
  constructor(private route: ActivatedRoute, private service: GetDataService, private router: Router) {}

  ngOnInit() {
    this.topicId = this.route.snapshot.paramMap.get('topicId') || '';

    this.service.getSingleTopic(this.topicId).subscribe((thema: ITopic | undefined) => {
      if (thema) {
        this.themengebietName = thema.name;
      }
    });

    this.unterthemen$ = this.service.getSubtopics(this.themengebietName);
  }

  navigateToUnterthema(subtopicId: string) {
    this.router.navigate([subtopicId], { relativeTo: this.route });
  }

  toggleMenu(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  closeMenu() {
    this.activeMenuId = null;
  }

  bearbeiten(id: string) {
    console.log(`Bearbeiten: ${id}`);
    this.closeMenu();
  }

  loeschen(id: string) {
    console.log(`Löschen: ${id}`);
    this.closeMenu();
  }
}
