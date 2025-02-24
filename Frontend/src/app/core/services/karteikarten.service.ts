import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/*
Dies ist die Simulation der Karteikarten 
*/

@Injectable({
  providedIn: 'root'
})
export class KarteikartenService {
  private themengebiete = [
    { id: 1, name: 'Politik', unterthemen: [
      { id: 101, name: 'Wahlen', karteikarten: [
        { frage: 'Was ist eine Demokratie?', antwort: 'Eine Regierungsform, in der das Volk regiert.' },
        { frage: 'Was ist eine Wahl?', antwort: 'Ein Verfahren, bei dem Bürger Vertreter wählen.' }
      ]},
      { id: 102, name: 'Gesetze', karteikarten: [
        { frage: 'Was ist ein Grundgesetz?', antwort: 'Die Verfassung eines Staates.' }
      ]}
    ]},
    { id: 2, name: 'Physik', unterthemen: [
      { id: 201, name: 'Mechanik', karteikarten: [
        { frage: 'Was ist die Schwerkraft?', antwort: 'Die Anziehungskraft der Erde.' }
      ]},
      { id: 202, name: 'Quantenphysik', karteikarten: [
        { frage: 'Was ist ein Quantenbit?', antwort: 'Eine Einheit der Quanteninformation.' }
      ]}
    ]}
  ];

  getThemengebiete(): Observable<any[]> {
    return of(this.themengebiete);
  }

  getUnterthemen(themengebietId: number): Observable<any[]> {
    const themengebiet = this.themengebiete.find(t => t.id === themengebietId);
    return of(themengebiet ? themengebiet.unterthemen : []);
  }

  getKarteikarten(themengebietId: number, unterthemaId: number): Observable<any[]> {
    const themengebiet = this.themengebiete.find(t => t.id === themengebietId);
    const unterthema = themengebiet?.unterthemen.find(u => u.id === unterthemaId);
    return of(unterthema ? unterthema.karteikarten : []);
  }
}
