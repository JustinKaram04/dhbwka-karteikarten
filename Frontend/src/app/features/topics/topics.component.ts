import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; //für ngIf
import { FormsModule } from '@angular/forms';   //für ngModule
import { Router } from '@angular/router'; //navigation
import { Observable, Subject, BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

import { ITopic } from '../../core/models/itopic'; //Datenstruktur
import { GetDataService } from '../../core/services/getDataServices/get-data.service'; //API Service
import { HeaderComponent } from '../../shared/components/header/header.component'; //Header

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent
  ],
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  private reloadTrigger$ = new Subject<void>(); //löst neulanden aus
  topics$!: Observable<ITopic[]>; //alle topics von service
  private searchQuery$  = new BehaviorSubject<string>('');  // suchbegriff
  private sortCriteria$ = new BehaviorSubject<string>('name-asc'); // sotierung
  filteredTopics$!: Observable<ITopic[]>; // gefilterte + sotierte Topics

  hoveredId:    number | null = null; //ID bei hover
  activeMenuId: number | null = null; //ID von menu
  showAddTopicInput  = false; //Formular anzeigen
  isAddingTopic      = false; //anti Doppelanfragen

  newTopicName        = ''; //Name neuer Topic
  newTopicDescription = ''; //Beschriebung neuer Topic

  editingTopicId:        number | null = null;  //ID im bearbeiten modus
  editedTopicName        = '';  //Neuer name beim bearbeiten
  editedTopicDescription = '';  //neue beschreibung beim Bearbeiten

  constructor(
    private themenService: GetDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Topics laden und neu laden bei reloadTrigger
    this.topics$ = this.reloadTrigger$.pipe(
      startWith(void 0),  //Trigger
      switchMap(() =>
        this.themenService.getTopics().pipe(
          catchError(() => of([] as ITopic[])) //bei fehler leeres array
        )
      ),
      shareReplay(1)  //cache für subscribers
    );

    //Filter & Sort
    this.filteredTopics$ = combineLatest([
      this.topics$,
      this.searchQuery$,
      this.sortCriteria$
    ]).pipe(
      map(([topics, query, crit]) => {
        let gefiltert = topics;
        if (query.trim()) {
          //name filtern
          gefiltert = gefiltert.filter(t =>
            t.name.toLowerCase().includes(query.toLowerCase())
          );
        }
        return this.sortTopics(gefiltert, crit);  //sotieren
      })
    );
  }

  //Sotierlogik nach auswahl
  private sortTopics(topics: ITopic[], crit: string): ITopic[] {
    return topics.sort((a, b) => {
      switch (crit) {
        case 'name-asc':   return a.name.localeCompare(b.name);
        case 'name-desc':  return b.name.localeCompare(a.name);
        case 'id-asc':     return a.id - b.id;
        case 'id-desc':    return b.id - a.id;
        default:           return 0;
      }
    });
  }

  //bei eingabe in Suchfeld
  updateSearchQuery(e: Event) {
    const wert = (e.target as HTMLInputElement).value;
    this.searchQuery$.next(wert);
  }

  //bei auswahl im Dropdown
  updateSortCriteria(e: Event) {
    const wert = (e.target as HTMLSelectElement).value;
    this.sortCriteria$.next(wert);
  }

  //Navigation zu unterthemen
  navigateToTopic(id: number, e: MouseEvent) {
    if (!['BUTTON','INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
      this.router.navigate(['/themengebiet', id]);
    }
  }

  //ein / ausblenden menu
  toggleMenu(id: number, e: MouseEvent) {
    e.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  //bearbeiten starten, felder mit aktuellen werten füllen
  startEditing(topic: ITopic, e: MouseEvent) {
    e.stopPropagation();
    this.editingTopicId         = topic.id;
    this.editedTopicName        = topic.name;
    this.editedTopicDescription = topic.description;
  }

  // topics speichern
  saveTopic() {
    if (this.editingTopicId === null || !this.editedTopicName.trim()) return;

    this.themenService.updateTopic(
      this.editingTopicId,
      {
        name: this.editedTopicName.trim(),
        description: this.editedTopicDescription.trim()
      }
    ).subscribe({
      next: () => {
        this.reloadTrigger$.next(); //seite neu laden
        this.editingTopicId = null; //bearbeiten modus beendn
      },
      error: err => console.error('❌ Fehler beim Speichern:', err)
    });
  }

  //topics löschen mit bestätigung
  deleteTopic(id: number, e: MouseEvent) {
    e.stopPropagation();
    if (!confirm('Soll dieses Thema wirklich gelöscht werden?')) return;
    this.themenService.deleteTopic(id).subscribe({
      next: () => {
        this.activeMenuId = null;
        this.reloadTrigger$.next(); //neu laden
      },
      error: err => console.error('❌ Fehler beim Löschen:', err)
    });
  }

  //bearbeiten abbrechen
  cancelEditing() {
    this.editingTopicId = null;
  }

  //neue Topics hinzufügen
  addTopic(): void {
    if (this.isAddingTopic || !this.newTopicName.trim()) return;
    this.isAddingTopic = true;

    const name        = this.newTopicName.trim();
    const description = this.newTopicDescription.trim();
    this.newTopicName        = '';
    this.newTopicDescription = '';

    this.themenService.addTopic(name, description).subscribe({
      next: () => {
        this.showAddTopicInput = false; //Formular verbergen
        this.activeMenuId      = null;
        this.reloadTrigger$.next(); //neu laden
      },
      error: err => console.error('❌ Fehler beim Anlegen:', err),
      complete: () => { this.isAddingTopic = false; }
    });
  }

  //schließt menu bei klick auserhalb
  closeMenu() {
    this.activeMenuId = null;
  }
}
