import { Component } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { compileNgModule } from '@angular/compiler';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private taskService: TaskService, private authService: AuthService) { }

  public tareas_recomendadas:any


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
    let data = (response['message'].toString()).split("-")

    let arrayAux = []
    
    for(let task of data){
      let lineas = task.trim().split("\n")
      let arrayTareas = []
      for(let linea of lineas){
        let clave = linea.split(":")[0]
        let valor = linea.split(":")[1]
        if (clave == "categoria"){
          valor=valor.split(',')
        }
        arrayTareas.push({[clave]: valor})
      }
      arrayAux.push({arrayTareas})
    }
    this.tareas_recomendadas = arrayAux
    console.log(this.tareas_recomendadas)
  }
}
