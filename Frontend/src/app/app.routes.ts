import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ThemengebieteComponent } from './features/themengebiete/themengebiete.component';
import { UnterthemenComponent } from './features/unterthemen/unterthemen.component';
import { InfoComponent } from './features/info/info.component';
import { FlashcardPreviewComponent } from './features/flashcard-preview/flashcard-preview.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', component: DashboardComponent },     
  { path: 'themengebiet/:topicId', component: ThemengebieteComponent },  
  { path: 'themengebiet/:topicId/:subtopicId', component: UnterthemenComponent, children: [
    { 
      path: 'lernmodus', 
      component: FlashcardPreviewComponent 
    }
  ] 
}  
,
  { path: 'info', component: InfoComponent },
  { path: '**', redirectTo: '' }, 
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
