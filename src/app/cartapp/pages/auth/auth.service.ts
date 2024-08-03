import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _http = inject(HttpClient);
  _router = inject(Router)
  constructor() { }

  regisgter(payload:{}){
    return this._http.post<any>(`${environment.mongodb_api_url}register`,payload);
  }

  signin(payload:{}){
    return this._http.post<any>(`${environment.mongodb_api_url}signin`,payload);
  }
  
  signout(){
    sessionStorage.clear();
    this._router.navigate(["./signin"]);
  }
}
