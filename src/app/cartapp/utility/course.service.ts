import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private _http : HttpClient) { }

  fetchProducts = () : any => {
    let hh = new HttpRequest<any>("GET", `${environment.product_api_url}appliances?size=10`);
    return this._http.request(hh);
  }
}
