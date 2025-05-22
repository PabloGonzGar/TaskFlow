import { Component } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-configuracion',
  imports: [NgStyle,NgFor, NgIf, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {
  constructor(private taskService: TaskService){}

  tags:any[] = []

  modalUpdate = false
  modalDelete = false


  tag_to_update = {
    id: '',
    name: '',
    color: ''
  }


  tag_to_delete = ''

  ngOnInit(){
    this.taskService.getAllTags().subscribe({
      next: (data) => {
        this.getTags(data);
      }
    });
  }


  getTags(data:any){
    let arrayAux = [];
    for (let tag of data) {
      arrayAux.push({
        'id': tag.id,
        'name': tag.name,
        'color': tag.color
      });
    }
    this.tags = arrayAux;
  }

  editarCategoria(tag:any){
    this.tag_to_update = tag
    console.log(this.tag_to_update)
    this.modalUpdate = true
  }

  eliminarCategoria(tag:any){
    this.tag_to_delete = tag

    this.taskService.deleteTag(this.tag_to_delete).subscribe({
      next: (data) =>{
        console.log(data)
      }
    })

    window.location.reload()
  }
  guardarCategoria(){
    this.taskService.updateTag(this.tag_to_update).subscribe({
      next: (data)=>{
        console.log(data)
      }
    })

  }

  cancelar(){
    this.modalUpdate = false
  }
}
