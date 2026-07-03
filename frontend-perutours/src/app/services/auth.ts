import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRequest } from '../model/api/request/user-request';
import { UserResponse } from '../model/api/response/user-response';
import { Session } from './session';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'https://e9a1-38-25-18-236.ngrok-free.app/api/auth';

  constructor(private http: HttpClient, private sessionService: Session) {}

  login(req: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, req).pipe(
      tap(response => {
        if (response && response.success && response.user) {
          this.sessionService.setSession(response.user);
        }
      })
    );
  }
}
