import { ISubtopic } from "./isubtopic";
export interface ITopic {
  id: number;         // von string → number
  name: string;
  description: string;
  subtopics?: ISubtopic[];
}

