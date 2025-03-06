import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IFlashcard } from '../../models/iflashcard';
import { find, Observable, of } from 'rxjs';
import { map } from 'rxjs';
import { ITopic } from '../../models/itopic';
import { ISubtopic } from '../../models/isubtopic';
import { OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  baseURL: string = 'http://localhost:3000/';
  TopicURL: string = this.baseURL + 'topics';
  public TopicList: Observable<ITopic[]> = of([]); 


  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    this.loadingTopics();
}
 

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

getSingleTopic(id: string): ITopic | undefined {
  let foundTopic: ITopic | undefined;
  
  this.TopicList.pipe(
    map(topics => topics.find(topic => topic.id === id))
  ).subscribe(topic => {
    foundTopic = topic;
  });

  return foundTopic;
}


  getSubtopics(topicName: string): Observable<ISubtopic[]> {
    return this.TopicList.pipe(
      map(topics => {
        const topic = topics.find(t => t.name === topicName); // Use Array.find
        return topic ? topic.subtopics : []; // Return subtopics or empty array
      })
    );
  }

  getFlashcards (subtopicid: string): Observable<IFlashcard[]> {
    return this.http.get<IFlashcard[]>(this.baseURL + 'flashcards?subtopic=' + subtopicid);
  }



}
