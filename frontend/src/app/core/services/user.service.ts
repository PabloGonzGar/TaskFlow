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

}
