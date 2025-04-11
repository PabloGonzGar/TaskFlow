import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) { }
  
    api_url = 'http://127.0.0.1:8000/api/users/'
  
    // para las peticiones, al haber auth, se debe agregar el token
  
    private getHeaders() {    
  
      const token = this.authService.getAccessToken()
      return ({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }

    getUserStats(){
      return this.http.get(this.api_url+'stats/', {headers: this.getHeaders()})
    }





}
