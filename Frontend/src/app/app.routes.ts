import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { InfoComponent } from './features/info/info.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent }, // Startseite
    { path: 'info', component: InfoComponent }, // Infoseite
    { path: '**', redirectTo: '' } // Fallback zur Startseite
];
