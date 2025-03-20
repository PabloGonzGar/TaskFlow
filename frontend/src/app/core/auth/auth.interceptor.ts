// src/app/core/auth/auth.interceptor.ts
import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError, BehaviorSubject } from 'rxjs'
import { catchError, switchMap, filter, take } from 'rxjs/operators'
import { AuthService } from './auth.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken()

    let authReq = req
    if (accessToken) {
      authReq = this.addToken(req, accessToken)
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && accessToken) {
          return this.handle401Error(authReq, next)
        }
        return throwError(() => error)
      })
    )
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true
      this.refreshTokenSubject.next(null)

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false
          const newAccessToken = this.authService.getAccessToken()
          this.refreshTokenSubject.next(newAccessToken)
          return next.handle(this.addToken(request, newAccessToken!))
        }),
        catchError(error => {
          this.isRefreshing = false
          this.authService.logout().subscribe()
          return throwError(() => error)
        })
      )
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(request, token!)))
      )
    }
  }
}