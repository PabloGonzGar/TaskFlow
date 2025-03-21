import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public credeentials = {
    email: '',
    name: '',
    password: '',
  }
  public errorMessage: string | null = null
  public confirmPassword: string | null = null

  constructor(private authService: AuthService, private router: Router) { }

  register():void{
    this.errorMessage = null

    console.log(this.credeentials.password);
    console.log(this.confirmPassword);

    if(this.confirmPassword===this.credeentials.password){

      this.authService.register(this.credeentials).subscribe({
        next: () => {
          console.log('exito');
          this.router.navigate(['/dashboard'])
        },
        error: (error) => {
          console.log(error);
          this.errorMessage = error.error.error
        }
      })

    }else{
      this.errorMessage = 'Las contraseñas no coinciden'
    }
  }

}
