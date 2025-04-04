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



  getRecomendedTasks() {
    return this.http.get(this.api_url + 'recommendations/', {headers: this.getHeaders()})
  }

  getAllTags(){
    return this.http.get(this.api_url + 'tags/', {headers: this.getHeaders()})
  }

  createTask(task:any){
    return this.http.post(this.api_url + 'create/', task, {headers: this.getHeaders()})
  }
}
