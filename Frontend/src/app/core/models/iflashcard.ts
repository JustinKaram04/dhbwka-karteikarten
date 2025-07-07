import { ISubtopic } from "./isubtopic";

export interface IFlashcard {
  id: number;
  question: string;
  answer: string;
  learningProgress: number;
  isToggled: boolean;
  subtopic?: ISubtopic;
}
