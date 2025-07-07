import { Injectable } from '@angular/core'; //injectable decorator damit angular weiß, dass man das via DI reinholen kann
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'; //interceptor-typen von angular
import { Observable } from 'rxjs'; // observable weil next.handle ein observable zurückgibt
import { AuthService } from '../services/auth/auth.service'; // unser auth-servie, der token speichert und liefert

@Injectable() // angular-dekorator, ohne den funzt das ding nicht als interceptor
export class AuthInterceptor implements HttpInterceptor { // implementiert das HttpInterceptor-interface
  constructor(private auth: AuthService) {} // hier holen wir uns den auth-service über dependency injection rein

  intercept(
    req: HttpRequest<any>, // original-request, immutable ding
    next: HttpHandler// handler der die request weiterleitet
  ): Observable<HttpEvent<any>> {
    const token = this.auth.getToken(); // token aus storage/servie holen
    if (token) {
      // wenn token da is, kopier request und häng authorization-header dran
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(authReq); // mit modifizierter request weitermachen
    }
    // kein token vorhanden, schick request unverändert weiter
    return next.handle(req);
  }
}
