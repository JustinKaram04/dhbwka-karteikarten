import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router'; // canActivate-interface & router zum weiterleiten
import { AuthService } from '../auth/auth.service'; // unser auth-service der token verwaltet

@Injectable({ providedIn: 'root' }) // service an root hängen is überall verfügbar
export class AuthGuard implements CanActivate { // guard fürs schützen von routes
  constructor(
    private auth: AuthService, // auth-service reinziehen
    private router: Router// router zum navigieren
  ) {}

  canActivate(): boolean { // angular fragt hier: darf der user auf die route?
    if (this.auth.getToken()) return true; // token da → alles gut, zugang erlauben
    this.router.navigate(['/login']);// kein token → weiterleiten zur login-seite
    return false;// zugang verweigern
  }
}
