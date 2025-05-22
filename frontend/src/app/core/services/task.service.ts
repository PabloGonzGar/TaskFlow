import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  api_url = 'http://127.0.0.1:8000/api/tasks/'

  // para las peticiones, al haber auth, se debe agregar el token

  private getHeaders() {    

    const token = this.authService.getAccessToken()
    return ({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  setCompleteTask(task:any){
    return this.http.put(this.api_url + 'completed/' + task +'/', {headers: this.getHeaders()})
  }

  deleteTag(tag:any){
    return this.http.delete(this.api_url+ 'admin/tags/delete/'+tag + '/', {headers:this.getHeaders()})
  }

  getRecomendedTasks() {
    return this.http.get(this.api_url + 'recommendations/', {headers: this.getHeaders()})
  }

  getAllTags(){
    return this.http.get(this.api_url + 'tags/', {headers: this.getHeaders()})
  }

  createTask(task:any){
    return this.http.post(this.api_url + 'create/', task, {headers: this.getHeaders()})
  }

  getTasksByUser(){
    return this.http.get(this.api_url + 'tasks/', {headers: this.getHeaders()})
  }

  updateTask(task:any){
    return this.http.put(this.api_url + 'update/', task, {headers: this.getHeaders()})
  }

  updateTag(tag:any){
    return this.http.put(this.api_url + 'admin/tags/update/', tag , {headers: this.getHeaders()})
  }

  deleteTask(task:any){
    return this.http.delete(this.api_url + 'delete/' + task +'/', {headers: this.getHeaders()})
  }

  
}



