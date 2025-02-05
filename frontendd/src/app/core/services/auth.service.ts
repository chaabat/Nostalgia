import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '../models/auth.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'token';
  private jwtHelper = new JwtHelperService();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {
    this.store.dispatch(AuthActions.init());
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.isAuthenticatedSubject.next(true);
      const decodedToken = this.jwtHelper.decodeToken(token);
      const user: User = {
        id: decodedToken.sub || '0',
        username: decodedToken.sub,
        email: decodedToken.email || '',
        roles: decodedToken.roles || [],
        active: decodedToken.active || true,
        createdAt: new Date(),
      };
      this.currentUserSubject.next(user);
    } else {
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Login failed');
        }
        localStorage.setItem('token', response.data.token);
        
        const user: User = {
          id: response.data.username,
          username: response.data.username,
          email: '',  // Or get from token if available
          roles: response.data.roles,
          active: true,
          createdAt: new Date()
        };
        
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasValidToken(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.roles || [];
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }

  isAdmin(): boolean {
    return this.getUserRoles().includes('ADMIN');
  }

  decodeToken(token: string) {
    return this.jwtHelper.decodeToken(token);
  }

  register(username: string, email: string, password: string): Observable<UserResponse> {
    const registerData: RegisterRequest = {
      username,
      email,
      password
    };

    return this.http.post<UserResponse>(`${this.apiUrl}/register`, registerData).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }
} 