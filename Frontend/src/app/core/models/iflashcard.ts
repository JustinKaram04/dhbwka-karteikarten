export interface IFlashcard {
    Id: string;
    subtopic: string; // 🔹 Die ID des Unterthemas, zu dem die Karteikarte gehört, nicht den Namen!!
    question: string;
    answer: string;
    istoggled: boolean;
    learningProgress: number; //between 0 and 6
}
