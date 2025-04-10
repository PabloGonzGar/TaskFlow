import { NgFor, NgIf, NgStyle } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../core/auth/auth.service'
import { TaskService } from '../../core/services/task.service'
import { LOCALE_ID } from '@angular/core'
import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es'
import { CommonModule } from '@angular/common'

registerLocaleData(localeEs)


@Component({
  selector: 'app-task',
  imports: [NgIf, FormsModule, NgFor, NgStyle, CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]     
})
export class TaskComponent {

  public modal = false
  public modalUpdate = false
  public newTask = {
    title:'',
    description:'',
    end_date:'',
    tags: []
  }

  updateTask = {
    title:'',
    description:'',
    end_date:'',
    tags: [],
    status:'',
    start_date:'',
    id:''
  }

  due_date = new Date()
  public tags:any = []
  public tasks:any[] = []


  constructor(private taskService: TaskService, private authService: AuthService) { }

  ngOnInit(): void {
    this.taskService.getAllTags().subscribe({
      next: (data) => {
        this.getTags(data)
      }
    })

    this.taskService.getTasksByUser().subscribe({
      next: (data) => {
        console.log(data)
        this.getTasks(data)
      }
    })
  }


  getTasks(data:any){
    this.tasks = data
  }


  activarModal(){
    console.log("abriendo modal") 
    this.modal = !this.modal
  }

  getTags(data:any){
    let arrayAux  = []
    for(let tag of data){
      arrayAux.push({
        'id': tag.id,
        'name': tag.name,
        'color': tag.color
      })
    }
    this.tags = arrayAux
    console.log(this.tags)
  }

  agregarTarea(){
    console.log(`Agregando tarea ${this.newTask.tags}`)
    this.newTask.end_date = new Date(this.due_date).toISOString()

    this.taskService.createTask(this.newTask).subscribe({
      next: (data) => {
        console.log(data)
        this.activarModal()
      }
    })

    window.location.reload()
  }
  
  
  
  activarModalUpdate(task?:any){
    this.modalUpdate = !this.modalUpdate
    this.updateTask = task
    
    console.log(this.updateTask)
    console.log(this.updateTask.end_date)
  }
  
  actualizarTarea(){
    this.updateTask
    this.taskService.updateTask(this.updateTask).subscribe({
      next: (data) => {
        console.log(data)
        this.activarModalUpdate()
      }
    })
    window.location.reload()
  }
}
