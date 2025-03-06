import { ISubtopic } from "./isubtopic";


export interface ITopic {
    id: string;
    name: string;
    description: string;
    subtopics: ISubtopic[];
}
