import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from './core/mainpage/mainpage.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  { path: 'mainpage', component: MainpageComponent },
  { path: 'login', component: LoginComponent},
  // Weitere Routen hier hinzufügen
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}