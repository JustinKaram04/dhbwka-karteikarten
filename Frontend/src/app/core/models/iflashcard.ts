import { ISubtopic } from "./isubtopic";

export interface IFlashcard {
  id: number;            // von string → number
  question: string;
  answer: string;
  learningProgress: number;
  istoggled: boolean;
  subtopic?: ISubtopic;
}
