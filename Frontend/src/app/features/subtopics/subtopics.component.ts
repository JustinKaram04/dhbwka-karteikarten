import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; //navigation
import { CommonModule } from '@angular/common'; //ngif
import { HeaderComponent } from '../../shared/components/header/header.component'; //header
import { GetDataService } from '../../core/services/getDataServices/get-data.service';  //api service
import { ISubtopic } from '../../core/models/isubtopic';  //Datenstruktur unterthemen
import { ITopic } from '../../core/models/itopic';  //datenstrucktur themengebiete
import { FormsModule } from '@angular/forms'; //ng model
import { BehaviorSubject, of, forkJoin, firstValueFrom } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-subtopics',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './subtopics.component.html',
  styleUrls: ['./subtopics.component.scss']
})
export class SubtopicsComponent implements OnInit {
  topicId!: number; //id aktuelles themengebiet
  themengebietName = '';  //name aktuelles themengebiet
  unterthemen$ = new BehaviorSubject<ISubtopic[]>([]);
  activeMenuId: number | null = null; //ID des geöffneten menus
  hoveredId: number | null = null;  //ID des gerade gehoverte unterthema

  showAddSubtopicInput = false; //Hinzufügen modus aktiv oder nicht
  newSubtopicName = ''; //name beim hinzufügen
  newSubtopicDescription = '';  //beschreibung beim hinzufügen

  editingSubtopicId: number | null = null;  //ID des bearbeiteten unerthema
  editedSubtopicName = '';  //zwischenspreicher name
  editedSubtopicDescription = ''; //zwischenspeicher beschreibung

  searchQuery = ''; //suchberiff für filter
  sortCriteria = 'name-asc';  //sotierkriterium

  constructor(
    private route: ActivatedRoute,
    private service: GetDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // parameter aus der route entnehmen und als zahl umwandeln
    const tid = this.route.snapshot.paramMap.get('topicId') || '0';
    this.topicId = parseInt(tid, 10);

    // Thema-Name holen, dann Unterthemen
    this.service.getTopics().pipe(
      map(topics => topics.find(t => t.id === this.topicId)), //aktuelles thema finden
      tap((t: ITopic | undefined) => this.themengebietName = t?.name || ''),  //name setzen
      switchMap(() => this.service.getSubtopics(this.topicId)), //unerthema laden
      catchError(() => of([] as ISubtopic[])) //bei fehler leeres array
    ).subscribe(subs => this.unterthemen$.next(subs));  //behaviorsubject mit daten füllen
  }

  //filter & sort anwenden
  applyFilters(): ISubtopic[] {
    return this.unterthemen$.value
      .filter(s => s.name.toLowerCase().includes(this.searchQuery.toLowerCase())) //suche
      .sort((a, b) => { //sotierung nach kriterium
        switch (this.sortCriteria) {
          case 'id-asc':    return a.id - b.id;
          case 'id-desc':   return b.id - a.id;
          case 'name-asc':  return a.name.localeCompare(b.name);
          case 'name-desc': return b.name.localeCompare(a.name);
          default:          return 0;
        }
      });
  }

  //sotierkriterium ändern
  updateSortOption(e: Event) {
    this.sortCriteria = (e.target as HTMLSelectElement).value;
  }

  //navigation zu karteikarten
  navigateToUnterthema(id: number, e: MouseEvent) {
    const tag = (e.target as HTMLElement).tagName;
    if (['BUTTON','INPUT','TEXTAREA'].includes(tag)) return;
    // Route: /themengebiet/:topicId/:subtopicId
    this.router.navigate([id], { relativeTo: this.route });
  }

  //neues unterthema erstellen
  async addSubtopic(): Promise<void> {
    if (!this.newSubtopicName.trim()) return;

    //api aufruf
    const created = await firstValueFrom(
      this.service.addSubtopic(
        this.topicId,
        this.newSubtopicName.trim(),
        this.newSubtopicDescription.trim()
      )
    );
    //neues unterthema an liste hängen
    this.unterthemen$.next([...this.unterthemen$.value, created]);
    this.newSubtopicName = '';
    this.newSubtopicDescription = '';
    this.showAddSubtopicInput = false;  //formular verbergen
  }

  //menu ein #7 ausblenden
  toggleMenu(id: number, e: MouseEvent) {
    e.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  //bearbeiten starten
  startEditing(sub: ISubtopic, e: MouseEvent) {
    e.stopPropagation();
    this.editingSubtopicId = sub.id;
    this.editedSubtopicName = sub.name;
    this.editedSubtopicDescription = sub.description || '';
  }

  //änderungen speichern
  async saveSubtopic(): Promise<void> {
    if (this.editingSubtopicId === null || !this.editedSubtopicName.trim()) return;
    //api aufruf
    const updated = await firstValueFrom(
      this.service.updateSubtopic(
        this.topicId,
        this.editingSubtopicId,
        {
          name: this.editedSubtopicName.trim(),
          description: this.editedSubtopicDescription.trim()
        }
      )
    );
    //liste aktualisieren
    this.unterthemen$.next(
      this.unterthemen$.value.map(s =>
        s.id === this.editingSubtopicId ? updated : s
      )
    );
    this.editingSubtopicId = null;  //bearbeiten modus beenden
  }

  //unterthema löschen, erst karten dann unterthema
  loeschen(subtopicId: number, event: MouseEvent): void {
    event.stopPropagation();
    if (!confirm('❗ Wirklich löschen?')) return;
    this.service.getFlashcards(this.topicId, subtopicId).pipe(
      take(1),  //einmalige subscripton
      switchMap(flashcards => {
        //alle karten des unterthemas löschen
        const deletes = flashcards.map(c =>
          this.service.deleteFlashcard(this.topicId, subtopicId, c.id)
        );
        return deletes.length ? forkJoin(deletes) : of(null);
      }),
      switchMap(() => this.service.deleteSubtopic(this.topicId, subtopicId)), //dann unterthema löschen
      tap(() => {
        //aus behaviorsubject liste entfernen
        this.unterthemen$.next(
          this.unterthemen$.value.filter(s => s.id !== subtopicId)
        );
      })
    ).subscribe();
  }

  //bearbeiten abbrechen
  cancelEditing() {
    this.editingSubtopicId = null;
  }

  //menu schließen
  closeMenu() {
    this.activeMenuId = null;
  }

  //zurück zur hauptseite
  goBack() {
    this.router.navigate(['/']);
  }
}
