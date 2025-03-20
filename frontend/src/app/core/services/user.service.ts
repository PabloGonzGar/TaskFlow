import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor() { }

  private baseUrl = 'http://localhost:8000/api/users/'
  private headers = { 'Content-Type': 'application/json' }
  private http =inject(HttpClient)

  public identifiedUser:any = null


  //PETICION DE REGISTRO
  userRegister(userData:{email:string,name:string,password:string}){

    //agregamos a la url basica el endpoint
    let url = `${this.baseUrl}register`

    //enviamos la peticion
    return this.http.post(url,userData,{headers:this.headers}).subscribe(
      (response: any) => {
        console.log('registro completadp', response);
        //si pasa agregamos a nuestro objeto de usuario el dato recibido
        this.identifiedUser = response.user
        //y guardamos el token de acceso y refresco a local storage
        localStorage.setItem('access_token', response.access_token)
        localStorage.setItem('refresh_token', response.refresh_token)
      },
      (error) => {
        //si no pasa mostramos un mensaje de error
        console.log('Error en el registro', error);
      }
    )
  }





}
