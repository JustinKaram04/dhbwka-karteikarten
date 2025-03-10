export interface IFlashcard {
    id: string;
    question: string;
    answer: string;
    istoggled: boolean;
    learningProgress: number; //between 0 and 6
}

