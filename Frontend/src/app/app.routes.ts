import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { InfoComponent } from './features/info/info.component';
import { ThemengebieteComponent } from './features/themengebiete/themengebiete.component';
import { UnterthemenComponent } from './features/unterthemen/unterthemen.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent }, // Startseite    
    { path: 'themen/:id', component: ThemengebieteComponent },
    { path: 'themen/:id/:unterthemaId', component: UnterthemenComponent }, // Route für Unterthemen
    { path: 'info', component: InfoComponent }, // Infoseite
    { path: '**', redirectTo: '' }, // Fallback zur Startseite
];
