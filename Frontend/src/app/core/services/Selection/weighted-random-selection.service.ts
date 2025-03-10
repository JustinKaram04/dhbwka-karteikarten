import { Injectable } from '@angular/core';
import { IFlashcard } from '../../models/iflashcard';

@Injectable({
  providedIn: 'root'
})
export class WeightedRandomSelectionService<T extends IFlashcard> {
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
