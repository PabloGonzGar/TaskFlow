import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { NgClass, NgFor } from '@angular/common';
import { _parseObjectDataRadialScale } from 'chart.js/helpers';

@Component({
  selector: 'app-usuarios',
  imports: [NgFor, NgClass],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  constructor(private userService: UserService) { }

  users = []

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.getAllUsers(data)
      }
    })
  }


  getAllUsers(data: any) {
    this.users = Object.values(data)
    console.log(this.users)
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: (data) => {
        console.log(data)
      }
    })
    window.location.reload();

  }

}
