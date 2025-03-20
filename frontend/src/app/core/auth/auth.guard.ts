// src/app/core/auth/auth.guard.ts
import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthService } from './auth.service'
import { Observable, of } from 'rxjs'
import { tap, switchMap, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return of(true)
        }
        return this.authService.refreshToken().pipe(
          switchMap(() => of(true)),
          catchError(() => {
            this.router.navigate(['/'])
            return of(false)
          })
        )
      }),
      tap(isAllowed => {
        if (!isAllowed) {
          this.router.navigate(['/'])
        }
      })
    )
  }
}