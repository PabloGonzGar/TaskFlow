import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from "./public/register/register.component";
import { LoginComponent } from "./public/login/login.component";
import { LandingComponent } from './public/landing/landing.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RegisterComponent, LoginComponent, LandingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
