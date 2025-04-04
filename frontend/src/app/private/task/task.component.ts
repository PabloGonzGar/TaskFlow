import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-task',
  imports: [NgIf, FormsModule, NgFor],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'      
})
export class TaskComponent {

  public modal = false;
  public newTask = {
    title:'',
    description:'',
    end_date:'',
    tags: []
  }

  public tags:any = []


  constructor(private taskService: TaskService, private authService: AuthService) { }

  ngOnInit(): void {
    this.taskService.getAllTags().subscribe({
      next: (data) => {
        this.getTags(data);
      }
    })
  }


  activarModal(){
    console.log("abriendo modal") 
    this.modal = !this.modal;
  }

  getTags(data:any){
    let arrayAux  = [];
    for(let tag of data){
      arrayAux.push({
        'id': tag.id,
        'name': tag.name,
        'color': tag.color
      })
    }
    this.tags = arrayAux;
    console.log(this.tags)
  }

  agregarTarea(){
    console.log(this.newTask)
    this.newTask.end_date = new Date(this.newTask.end_date).toISOString();

    this.taskService.createTask(this.newTask).subscribe({
      next: (data) => {
        console.log(data)
        this.activarModal();
      }
    })
  }
}
