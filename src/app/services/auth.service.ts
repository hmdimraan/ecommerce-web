import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginModel } from '../models/login.model';
import { RegisterModel } from '../models/register.model';
import { AuthResponse } from '../models/auth-response.model';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  register(data: RegisterModel): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/register`,
      data
    );
  }

  login(data: LoginModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/login`,
      data
    );
  }

 logout() {

  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}
  saveToken(token: string) {

  if (typeof window !== 'undefined')
    localStorage.setItem('token', token);
}

  getToken(): string | null {

  if (typeof window === 'undefined')
    return null;

  return localStorage.getItem('token');
}

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getRole(): string {

  const token = this.getToken();

  if (!token)
    return '';

  const decoded: any = jwtDecode(token);

  return decoded[
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
  ];
}

getUserId(): number {

  const token = this.getToken();

  if (!token)
    return 0;

  const decoded: any = jwtDecode(token);

  return Number(
    decoded[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ]
  );
}
}