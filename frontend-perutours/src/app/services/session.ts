import { Injectable, signal } from '@angular/core';
import { UserSesion } from '../model/user-sesion';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Session {
  private currentUserSignal = signal<UserSesion | null>(null);

  constructor(private router: Router) {
    const savedSession = localStorage.getItem('perutours_session');
    if (savedSession) {
      this.currentUserSignal.set(JSON.parse(savedSession));
    }
  }

  get currentUser() {
    return this.currentUserSignal;
  }

  isLoggedIn(): boolean {
    return this.currentUserSignal() !== null;
  }

  setSession(user: UserSesion) {
    this.currentUserSignal.set(user);
    localStorage.setItem('perutours_session', JSON.stringify(user));
  }

  clearSession() {
    this.currentUserSignal.set(null);
    localStorage.removeItem('perutours_session');
    this.router.navigate(['/']);
  }
}
