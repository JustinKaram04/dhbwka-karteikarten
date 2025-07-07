import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GetDataService } from '../../core/services/getDataServices/get-data.service';
import { IFlashcard } from '../../core/models/iflashcard';
import { WeightedRandomSelectionService } from '../../core/services/Selection/weighted-random-selection.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-flashcard-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flashcard-preview.component.html',
  styleUrls: ['./flashcard-preview.component.css']
})
export class FlashcardPreviewComponent implements OnInit, AfterViewInit {
  @ViewChild('resultCanvas') resultCanvas!: ElementRef<HTMLCanvasElement>;

  flashcards: IFlashcard[] = [];  // alle flashcards, die wir vom backend laden
  currentFlashcard: IFlashcard | null = null;  // gerade angezeigte karte oder null
  learningProgress = 0;  // aktueller lernfortschritt der karte (0–6)
  correctCount = 0;  // anzahl korrekt beantworteter karten im limited-mode
  totalCount = 0;  // gesamtzahl zu lernender karten im limited-mode
  mode: 'infinite' | 'limited' | null = null;  // modus: 'infinite' = endlos, 'limited' = nur karten mit fortschritt<6, null = noch nicht gewählt
  endScreen = false;  // flag, ob end-screen angezeigt wird (bei limited-mode, wenn karten alle durch)
  isFlipped = false;  // flag, ob karte aktuell umgedreht ist
  leftClicked = false;  // klick-status für linke/rechte buttons (kann fürs styling genutzt werden)
  rightClicked = false;
  isDark = false;  // theme-flag fürs dunkle styling (falls benötigt)
  private chart: Chart | null = null;  // interne chart-js instanz, damit wir den chart zerstören können

  // ids aus der route, damit wir die richtige api-endpoint aufrufen
  private topicId!: number;
  private subtopicId!: number;

  constructor(
    private service: GetDataService,
    private selection: WeightedRandomSelectionService<IFlashcard>,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // topicId/subtopicId aus url-params lesen (fallback '0')
    const tid = this.route.snapshot.paramMap.get('topicId') || '0';
    this.topicId = parseInt(tid, 10);
    const sid = this.route.snapshot.paramMap.get('subtopicId') || '0';
    this.subtopicId = parseInt(sid, 10);

    // flashcards vom backend holen und ins array packen
    this.service.getFlashcards(this.topicId, this.subtopicId)
      .subscribe(cards => this.flashcards = cards);
  }

  ngAfterViewInit(): void {
  }

  // modus wählen und selection-algorithmus initialisieren
  selectMode(mode: 'infinite' | 'limited'): void {
    this.mode = mode;
    this.selection.initialize(this.flashcards, mode);
    if (mode === 'limited') {
      // im limited-mode nur karten zählen, deren fortschritt noch unter 6 ist
      this.totalCount = this.flashcards.filter(c => c.learningProgress < 6).length;
    }
    this.next(); // danach sofort erste karte anzeigen
  }

  // nächste karte holen oder endscreen anzeigen
  next(): void {
    const next = this.selection.nextCard();
    if (!next && this.mode === 'limited') {
      // keine karten mehr im limited-mode → endscreen anwerfen
      this.endScreen = true;
      // chart nach kleinem delay rendern, damit canvas bereitsteht
      setTimeout(() => this.renderChart(), 100);
    } else {
      this.currentFlashcard = next || null;
      this.updateProgress();
    }
  }

  // vorherige karte anzeigen, falls vorhanden
  previous(): void {
    const prev = this.selection.previousCard();
    if (prev) {
      this.currentFlashcard = prev;
      this.updateProgress();
    }
  }

  // aktualisiert die lokale variable für den lernfortschritt
  updateProgress(): void {
    this.learningProgress = this.currentFlashcard?.learningProgress || 0;
  }

  // passt den fortschritt um delta an, speichert in db und springt weiter
  changeProgress(delta: number): void {
    if (!this.currentFlashcard) return;
    const card = this.currentFlashcard;
    // clamp zwischen 0 und 6
    const newVal = Math.max(0, Math.min(6, card.learningProgress + delta));
    card.learningProgress = newVal;
    this.learningProgress = newVal;
    // update auf server
    this.service
      .updateLearningProgress(this.topicId, this.subtopicId, card.id, newVal)
      .subscribe(() => {
        // im limited-mode zählt positiver delta als korrekte antwort
        if (this.mode === 'limited' && delta > 0) {
          this.correctCount++;
        }
        this.next(); // direkt zur nächsten karte
      });
  }

  // zeichnet das doughnut-chart mit richtig/falsch daten
  renderChart(): void {
    if (!this.resultCanvas) return;
    // alten chart zerstören, falls schon gezeichnet
    if (this.chart) this.chart.destroy();
    const ctx = this.resultCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Richtig', 'Falsch'],
        datasets: [{
          data: [this.correctCount, this.totalCount - this.correctCount],
          backgroundColor: ['#2ecc71', '#e74c3c']
        }]
      },
      options: { responsive: true }
    });
  }

  // startet im limited-mode neu: counters resetten, chart killen und neu starten
  retry(): void {
    this.endScreen = false;
    this.correctCount = 0;
    this.chart?.destroy();
    this.selection.reset();
    this.next();
  }

  // schließt die preview und navigiert zurück zur themenübersicht
  close(): void {
    this.router.navigate(['/themengebiet', this.topicId, this.subtopicId]);
  }

  // togglet die karte (z.b. flip animation)
  toggleFlip(): void { this.isFlipped = !this.isFlipped; }
  // aliase für button-clicks
  nextCard(): void { this.next(); }
  previousCard(): void { this.previous(); }
}
