import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
  constructor(private authService: AuthService) { }

  public user = {
    id: '',
    email: '',
    name: '',
  }

  ngOnInit(): void {
    let userToParse = (localStorage.getItem('currentUser'))
    if(userToParse){
      this.user = JSON.parse(userToParse)
    }
  }


  logout(){
    this.authService.logout()
  }
}
