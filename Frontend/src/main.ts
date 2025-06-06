import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

if (environment.production) enableProdMode();

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
