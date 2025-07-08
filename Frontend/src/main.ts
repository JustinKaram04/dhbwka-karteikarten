import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

if (environment.production) enableProdMode(); // in prod-mode bessere performance, disables angular warnings

bootstrapApplication(AppComponent, {// bootstrapped die ganze angular-app
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,// sagt angular: häng meinen interceptor ran
      useClass: AuthInterceptor,
      multi: true// mehrere interceptors erlaubt
    },
    provideRouter(routes)// liefert router-config aus app.routes
  ]
}).catch(err => console.error(err));
