import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeightedRandomSelectionService<T = any> {
  private items: T[] = [];

  initialize(items: T[]): void {
    this.items = items;
  }

  nextCard(): T | null {
    if (this.items.length === 0) {
      return null;
    }
    // Beispielhafte zufällige Auswahl
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  previousCard(): T | null {
    // Dummy-Implementierung: gibt das erste Element zurück
    return this.items[0] || null;
  }
}
