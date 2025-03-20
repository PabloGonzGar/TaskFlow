import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
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

  login():void{
    this.errorMessage = null
    this.authService.login(this.creedentials).subscribe({
      next: () => {
        console.log('exito');
        this.router.navigate(['/dashboard'])
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = error.error.error
      }
      
    })
  }

}
