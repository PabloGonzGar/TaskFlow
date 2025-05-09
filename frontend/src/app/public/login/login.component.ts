import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public creedentials = {
    email: '',
    password: ''
  }
  public errorMessage: string | null = null

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.currentUser) {
      this.authService.refreshToken()
      console.log("despues de refreshToken")
      console.log(this.authService.getAccessToken())
      console.log(this.authService.getRefreshToken())
      let user = localStorage.getItem('currentUser')
      if (user) {

        JSON.parse(user).is_admin == true ? this.router.navigate(['/admin']) : this.router.navigate(['/dashboard'])
      }

    }
  }

  login(): void {
    this.errorMessage = null
    this.authService.login(this.creedentials).subscribe({
      next: () => {
        console.log('exito')
        console.log(this.authService.currentUser);
        let user = localStorage.getItem('currentUser')
        if (user) {

          JSON.parse(user).is_admin == true ? this.router.navigate(['/admin']) : this.router.navigate(['/dashboard'])
        }
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = error.error.error
      }

    })
  }

}
