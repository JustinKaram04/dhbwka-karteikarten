import { Injectable } from '@angular/core';
import { IFlashcard } from '../../models/iflashcard';

@Injectable({
  providedIn: 'root'
})
export class WeightedRandomSelectionService<T extends IFlashcard> {
  private flashcards: T[] = [];
  private weights: number[] = [];
  private history: T[] = [];
  private remainingIndices: number[] = [];
  private currentPosition = -1;
  private mode: 'infinite' | 'limited' = 'infinite';
  private lastReviewed: Record<string, number> = {};

  initialize(fc: T[], mode: 'infinite' | 'limited' = 'infinite'): void {
    this.flashcards = fc;
    this.mode = mode;
    this.history = [];
    this.currentPosition = -1;
    this.weights = fc.map(c => this.getWeightForProgress(c.learningProgress));
    const now = Date.now();
    this.lastReviewed = {};
    fc.forEach(c => this.lastReviewed[c.id] = now);
    this.resetRemaining();
  }

  private getWeightForProgress(progress: number): number {
    switch (progress) {
      case 0: return 0.8;
      case 1: return 0.6;
      case 2: return 0.5;
      case 3: return 0.4;
      case 4: return 0.3;
      case 5: return 0.2;
      case 6: return 0.1;
      default: return 0;
    }
  }

  private applyDecay(card: T): void {
    if (card.learningProgress === 6) {
      const last = this.lastReviewed[card.id] || 0;
      if (Date.now() - last > 14 * 24 * 60 * 60 * 1000) {
        card.learningProgress = 3;
        const idx = this.flashcards.indexOf(card);
        if (idx >= 0) this.weights[idx] = this.getWeightForProgress(3);
      }
    }
  }

  private resetRemaining(): void {
    this.remainingIndices = this.mode === 'limited'
      ? this.flashcards.map((_, i) => i).filter(i => this.flashcards[i].learningProgress < 6)
      : this.flashcards.map((_, i) => i);
  }

  nextCard(): T | null {
    if (this.currentPosition < this.history.length - 1) {
      this.currentPosition++;
      return this.history[this.currentPosition];
    }
    if (this.mode === 'limited' && this.remainingIndices.length === 0) return null;
    if (this.mode === 'infinite' && this.remainingIndices.length === 0) this.resetRemaining();
    this.flashcards.forEach(c => this.applyDecay(c));
    const total = this.remainingIndices.reduce((s, i) => s + this.weights[i], 0);
    let r = Math.random() * total;

    for (let i = 0; i < this.remainingIndices.length; i++) {
      const idx = this.remainingIndices[i];
      r -= this.weights[idx];
      if (r < 0) {
        this.remainingIndices.splice(i, 1);
        const sel = this.flashcards[idx];
        this.history.push(sel);
        this.currentPosition = this.history.length - 1;
        this.lastReviewed[sel.id] = Date.now();
        return sel;
      }
    }

    return null;
  }

  previousCard(): T | null {
    if (this.currentPosition > 0) {
      this.currentPosition--;
      return this.history[this.currentPosition];
    }
    return null;
  }

  getHistory(): T[] {
    return [...this.history];
  }

  reset(): void {
    this.history = [];
    this.currentPosition = -1;
    this.resetRemaining();
  }
}


  /*
  flashcards: T[] = [];
  weights: number[] = [];
  history: T[] = [];
  remainingIndices: number[] = [];
  currentPosition: number = -1;

  getWeightForProgress(progress: number): number {
    switch(progress) {
      case 0: return 6;
      case 1: return 5;
      case 2: return 4;
      case 3: return 2;
      case 4: return 1;
      case 5: return 0.5;
      case 6: return 0;
      default: return 0;
    }
  }

  initialize(fc: T[]): void {
    this.flashcards = fc;
    console.log('Flashcards:', this.flashcards);
    this.weights = fc.map(card => 
      this.getWeightForProgress(card.learningProgress)
    );
    console.log('Weights:', this.weights);
    this.remainingIndices = Array.from({ length: fc.length }, (_, i) => i);
    this.history = [];
  }

  nextCard(): IFlashcard | null {
    if (this.currentPosition < this.history.length - 1) {
      // If we're navigating forward in history
      this.currentPosition++;
      return this.history[this.currentPosition];
    }
    if (this.remainingIndices.length === 0) return null;

    const totalWeight = this.remainingIndices.reduce(
      (sum, idx) => sum + this.weights[idx], 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < this.remainingIndices.length; i++) {
      const idx = this.remainingIndices[i];
      random -= this.weights[idx];
      if (random < 0) {
        const selectedIndex = this.remainingIndices.splice(i, 1)[0];
        const selectedItem = this.flashcards[selectedIndex];
        this.history.push(selectedItem);
        return selectedItem;
      }
    }

    return null;
  }

  previousCard(): T | null {
    if (this.currentPosition > 0) {
      // Move back in history
      this.currentPosition--;
      return this.history[this.currentPosition];
    }
    return null; // No previous card available
  }
  
  reset(): void {
    this.remainingIndices = Array.from({ length: this.flashcards.length }, (_, i) => i);
    this.history = [];
  }

  getHistory(): IFlashcard[] {
    return [...this.history];
  }
}
*/