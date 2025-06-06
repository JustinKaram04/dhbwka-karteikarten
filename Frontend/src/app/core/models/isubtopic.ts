import { IFlashcard } from './iflashcard';

export interface ISubtopic {
  id: number;         // von string → number
  name: string;
  description: string;
  flashcards?: IFlashcard[];
}
