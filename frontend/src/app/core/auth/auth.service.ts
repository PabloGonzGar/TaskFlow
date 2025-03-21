import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { Observable, BehaviorSubject, throwError } from 'rxjs'
import { tap, catchError, switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api' 
  private accessTokenKey = 'access_token' 
  private refreshTokenKey = 'refresh_token' 
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken())

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login/`, credentials).pipe(
      tap((response: any) => {
        if (response && response.accessToken && response.refreshToken) {
          localStorage.setItem(this.accessTokenKey, response.accessToken)
          localStorage.setItem(this.refreshTokenKey, response.refreshToken)
          this.isLoggedInSubject.next(true)
        }
      }),
      catchError(error => {
        console.error('Login failed', error)
        return throwError(() => error)
      })
    )
  }



  register(credeentials: {email:string, name:string,  password:string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register/`, credeentials).pipe(
      tap((response:any) => {
        if(response && response.accessToken && response.refreshToken){
          localStorage.setItem(this.accessTokenKey, response.accessToken)
          localStorage.setItem(this.refreshTokenKey, response.refreshToken)
          this.isLoggedInSubject.next(true)
        }
      }),
      catchError(error => {
        console.log('Register failed', error);
        return throwError(()=>error)
      })
    )
  }


  logout(): Observable<any> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      this.clearTokens()
      this.router.navigate(['/'])
      return throwError(() => new Error('No refresh token available'))
    }

    return this.http.post(`${this.apiUrl}/users/logout`, { refreshToken }).pipe(
      tap(() => {
        this.clearTokens()
        this.router.navigate(['/'])
      }),
      catchError(error => {
        console.error('Logout failed', error)
        this.clearTokens()
        this.router.navigate(['/'])
        return throwError(() => error)
      })
    )
  }


  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      this.clearTokens()
      return throwError(() => new Error('No refresh token available'))
    }

    return this.http.post(`${this.apiUrl}/users/refresh-token`, { refreshToken }).pipe(
      tap((response: any) => {
        if (response && response.accessToken) {
          localStorage.setItem(this.accessTokenKey, response.accessToken)
          localStorage.setItem(this.refreshTokenKey, response.refresh_token)
          this.isLoggedInSubject.next(true)
        }
      }),
      catchError(error => {
        console.error('Token refresh failed', error)
        this.clearTokens()
        this.router.navigate(['/'])
        return throwError(() => error)
      })
    )
  }


  private hasToken(): boolean {
    return !!localStorage.getItem(this.accessTokenKey)
  }


  private clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    this.isLoggedInSubject.next(false)
  }

  
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable()
  }

  
  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey)
  }

  
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey)
  }
}