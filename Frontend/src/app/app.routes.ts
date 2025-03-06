import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ThemengebieteComponent } from './features/themengebiete/themengebiete.component';
import { UnterthemenComponent } from './features/unterthemen/unterthemen.component';
import { InfoComponent } from './features/info/info.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', component: DashboardComponent }, // Startseite    
  { path: 'themen/:id', component: ThemengebieteComponent },
  { path: 'themen/:id/:unterthemaId', component: UnterthemenComponent }, // Route für Unterthemen
  { path: 'info', component: InfoComponent }, // Infoseite
  { path: '**', redirectTo: '' }, // Fallback zur Startseite
  // Weitere Routen hier hinzufügen
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
