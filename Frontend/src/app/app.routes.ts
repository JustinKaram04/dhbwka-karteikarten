import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ThemengebieteComponent } from './features/themengebiete/themengebiete.component';
import { UnterthemenComponent } from './features/unterthemen/unterthemen.component';
import { FlashcardsListComponent } from './features/flashcards-list/flashcards-list.component';
import { InfoComponent } from './features/info/info.component';
import { FlashcardPreviewComponent } from './features/flashcard-preview/flashcard-preview.component';
import { AuthGuard } from './core/services/authguard/authguard.service';
import { RegistrationComponent } from './features/auth/registration/registration.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegistrationComponent },
  { path: '', component: ThemengebieteComponent, canActivate: [AuthGuard] },
  { path: 'themengebiet/:topicId', component: UnterthemenComponent, canActivate: [AuthGuard] },
  { path: 'themengebiet/:topicId/:subtopicId', component: FlashcardsListComponent, canActivate: [AuthGuard] },
  { path: 'themengebiet/:topicId/:subtopicId/lernmodus', component: FlashcardPreviewComponent, canActivate: [AuthGuard] },
  { path: 'info', component: InfoComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
