import { Component } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { compileNgModule } from '@angular/compiler';
import { AuthService } from '../../core/auth/auth.service';
import { NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [NgFor, NgStyle],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private taskService: TaskService, private authService: AuthService) { }

  public tareas_recomendadas:any[]=[]


  ngOnInit() {
    this.authService.refreshToken()
      console.log("despues de refreshToken")
      console.log(this.authService.getAccessToken())
      console.log(this.authService.getRefreshToken())

    this.taskService.getRecomendedTasks().subscribe(
      (data) => {
        this.procesar_tareas(data)
      },
      error => {
        console.log(error);
      }
    );
  }

  procesar_tareas(response:any){
    this.tareas_recomendadas  = JSON.parse(response['message'].split('json')[1].split('```')[0])
    console.log(this.tareas_recomendadas)
  }
}
