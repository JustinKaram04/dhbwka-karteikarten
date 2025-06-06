import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegistrationComponent } from './features/auth/registration/registration.component';
import { TopicsComponent } from './features/topics/topics.component';
import { SubtopicsComponent } from './features/subtopics/subtopics.component';
import { FlashcardsListComponent } from './features/flashcards-list/flashcards-list.component';
import { FlashcardPreviewComponent } from './features/flashcard-preview/flashcard-preview.component';
import { InfoComponent } from './features/info/info.component';
import { AuthGuard } from './core/services/authguard/authguard.service';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegistrationComponent },
  {
    path: '',
    component: TopicsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'themengebiet/:topicId',
    component: SubtopicsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'themengebiet/:topicId/:subtopicId',
    component: FlashcardsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'themengebiet/:topicId/:subtopicId/lernmodus',
    component: FlashcardPreviewComponent,
    canActivate: [AuthGuard]
  },
  { path: 'info', component: InfoComponent },
  { path: '**', redirectTo: '' }
];
