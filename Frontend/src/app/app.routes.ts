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
  // login seite, kein auth-guard
  { path: 'login', component: LoginComponent },

  // registrierung seite
  { path: 'signup', component: RegistrationComponent },

  // hauptseite mit allen themengebieten, nur wenn eingeloggt
  {
    path: '',
    component: TopicsComponent,
    canActivate: [AuthGuard]
  },

  // unterthemen für bestimmtes themengebiet anzeigen
  {
    path: 'themengebiet/:topicId',
    component: SubtopicsComponent,
    canActivate: [AuthGuard]
  },

  // flashcards liste für unterthema
  {
    path: 'themengebiet/:topicId/:subtopicId',
    component: FlashcardsListComponent,
    canActivate: [AuthGuard]
  },

  // lernmodus/preview für flashcards
  {
    path: 'themengebiet/:topicId/:subtopicId/lernmodus',
    component: FlashcardPreviewComponent,
    canActivate: [AuthGuard]
  },

  // info seite ohne auth
  { path: 'info', component: InfoComponent },

  // fallback: alles andere zurück zur hauptseite
  { path: '**', redirectTo: '' }
];
