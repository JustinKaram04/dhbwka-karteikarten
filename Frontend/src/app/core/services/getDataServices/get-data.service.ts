// get-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITopic } from '../../models/itopic';
import { ISubtopic } from '../../models/isubtopic';
import { IFlashcard } from '../../models/iflashcard';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GetDataService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //topics
  getTopics(): Observable<ITopic[]> {
    return this.http.get<ITopic[]>(`${this.base}/topics`);
  }

  addTopic(name: string, description: string): Observable<ITopic> {
    return this.http.post<ITopic>(
      `${this.base}/topics`,
      { name, description }
    );
  }

  updateTopic(id: number, partial: Partial<ITopic>): Observable<ITopic> {
    return this.http.put<ITopic>(
      `${this.base}/topics/${id}`,
      partial
    );
  }

  deleteTopic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/topics/${id}`);
  }

  //subtopics
  getSubtopics(topicId: number): Observable<ISubtopic[]> {
    return this.http.get<ISubtopic[]>(`${this.base}/topics/${topicId}/subtopics`);
  }

  addSubtopic(topicId: number, name: string, description: string): Observable<ISubtopic> {
    return this.http.post<ISubtopic>(
      `${this.base}/topics/${topicId}/subtopics`,
      { name, description }
    );
  }

  updateSubtopic(
    topicId: number,
    subId: number,
    partial: Partial<ISubtopic>
  ): Observable<ISubtopic> {
    return this.http.put<ISubtopic>(
      `${this.base}/topics/${topicId}/subtopics/${subId}`,
      partial
    );
  }

  deleteSubtopic(topicId: number, subId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/topics/${topicId}/subtopics/${subId}`
    );
  }

  //flashcards
  getFlashcards(topicId: number, subId: number): Observable<IFlashcard[]> {
    return this.http.get<IFlashcard[]>(
      `${this.base}/topics/${topicId}/subtopics/${subId}/flashcards`
    );
  }

  addFlashcard(
    topicId: number,
    subId: number,
    question: string,
    answer: string
  ): Observable<IFlashcard> {
    return this.http.post<IFlashcard>(
      `${this.base}/topics/${topicId}/subtopics/${subId}/flashcards`,
      { question, answer }
    );
  }

  updateFlashcard(
    topicId: number,
    subId: number,
    cardId: number,
    partial: Partial<IFlashcard>
  ): Observable<IFlashcard> {
    return this.http.put<IFlashcard>(
      `${this.base}/topics/${topicId}/subtopics/${subId}/flashcards/${cardId}`,
      partial
    );
  }

  deleteFlashcard(
    topicId: number,
    subId: number,
    cardId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/topics/${topicId}/subtopics/${subId}/flashcards/${cardId}`
    );
  }

  updateLearningProgress(
    topicId: number,
    subId: number,
    cardId: number,
    learningProgress: number
  ): Observable<IFlashcard> {
    return this.http.patch<IFlashcard>(
      `${this.base}/topics/${topicId}/subtopics/${subId}/flashcards/${cardId}`,
      { learningProgress }
    );
  }
}
