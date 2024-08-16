import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user:string | null = null;
  _http = inject(HttpClient);
  _router = inject(Router);
  constructor() {
    setTimeout(() => {
      if (typeof window !== "undefined") this.user = JSON.parse(sessionStorage.getItem("shop_user_details") as string);
    }, 2200);
  }

  regisgter(payload:{}){
    return this._http.post<any>(`${environment.mongodb_api_url}register`,payload);
  }

  // fetch_orderId() {
  //   let payload = {email:this.user.email};
  //   return this._http.post<any>(`${environment.mongodb_api_url}fetch_orderId`,payload);
  // }

  signin(payload:{}){
    return this._http.post<any>(`${environment.mongodb_api_url}signin`,payload);
  }
  
  signout(){
    sessionStorage.clear();
    this._router.navigate(["./signin"]);
  }
}
