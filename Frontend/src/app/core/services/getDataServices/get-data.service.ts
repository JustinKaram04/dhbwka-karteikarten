import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IFlashcard } from '../../models/iflashcard';
import { find, Observable, of } from 'rxjs';
import { map } from 'rxjs';
import { ITopic } from '../../models/itopic';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  baseURL: string = 'http://localhost:3000/';
  TopicURL: string = this.baseURL + 'Topic';
  public TopicList: Observable<ITopic[]> = of([]); 


  constructor(private http: HttpClient) { }

  loadingTopics(): void {
    this.TopicList = this.http.get<ITopic[]>(this.TopicURL);
}

  getTopics(): Observable<ITopic[]> {
    return this.http.get<ITopic[]>(this.TopicURL);
}

  getTopicNames(): Observable<string[]> {
    return this.TopicList.pipe(
     map(topics => topics.map(topic => topic.name))
    );
}

  getSubtopics(topicName: string): Observable<string[]> {
    return this.TopicList.pipe(
      map(topics => {
        const topic = topics.find(t => t.name === topicName); // Use Array.find
        return topic ? topic.subtopics : []; // Return subtopics or empty array
      })
    );
  }

  getFlashcards (subtopic: string): Observable<IFlashcard[]> {
    return this.http.get<IFlashcard[]>(this.baseURL + 'Flashcard?subtopic=' + subtopic);
  }



}
