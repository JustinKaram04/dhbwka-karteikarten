import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from './core/mainpage/mainpage.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/components/dashboard.component';

export const routes: Routes = [
  { path: 'mainpage', component: MainpageComponent },
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent},
  // Weitere Routen hier hinzufügen
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}