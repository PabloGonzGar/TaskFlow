import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HostListener } from '@angular/core';
import { NgClass, NgIf, NgStyle } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass, NgIf],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {
    this.checkScreenSize()

  }

  public user = {
    id: '',
    email: '',
    name: '',
  }

  configModal = false

  activarConfigModal(){
    this.configModal = !this.configModal
  }

  color_fondo = 'from-primary-100 to-primary-200'

  cambiarFondo(color:string){
    this.color_fondo = color
    localStorage.setItem('bg-color',this.color_fondo)
  }



  @HostListener("window:resize")
  onResize() {
    this.checkScreenSize()
  }

  checkScreenSize() {
    if (window.innerWidth >= 768) {
      this.isSidebarOpen = true
    } else {
      this.isSidebarOpen = false
    }
  }

  sidebarOpen = false
  isSidebarOpen = false

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen
  }


  ngOnInit(): void {
    let userToParse = (localStorage.getItem('currentUser'))
    if (userToParse) {
      this.user = JSON.parse(userToParse)
    }
    this.comprobarColor()
  }

  comprobarColor(){
    let local_color = (localStorage.getItem('bg-color'))
    if(local_color!= '' && local_color){
      this.color_fondo=local_color
    }else{
      this.cambiarFondo(this.color_fondo)
    }
  }


  logout() {
    this.authService.logout().subscribe()
    this.router.navigate(['/landing'])
  }
}
