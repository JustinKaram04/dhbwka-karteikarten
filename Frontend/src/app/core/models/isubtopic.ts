import { IFlashcard } from "./iflashcard";

export interface ISubtopic {
    id: string;
    name: string;
    description: string;
    flashcards: IFlashcard[];
}