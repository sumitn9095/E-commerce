import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  _http = inject(HttpClient);
  constructor() { }

  fetchCart(){
    let user = 'sumit';
    let payloadObj = {username:user};
    let fetchAllProductsQuery = new HttpRequest<any>('Post',`${environment.mongodb_api_url}fetchAll`,payloadObj);
    return this._http.request(fetchAllProductsQuery);
  }

  fetchAllProducts(){
    let fetchAllProductsQuery = new HttpRequest<any>('Post',`${environment.mongodb_api_url}fetchAllProducts`,{});
    return this._http.request(fetchAllProductsQuery);
  }

  getCategoryList(){
    let categoryList = new HttpRequest<any>('GET', `${environment.mongodb_api_url}getCategories`);
    return this._http.request(categoryList);
  }

  filterProducts(payload:{}){
    let filterProductsQuery = new HttpRequest("POST",`${environment.mongodb_api_url}filterProducts`,payload);
    return this._http.request(filterProductsQuery);
  }

  getMaxProductPrice(){
    let maxProductPriceQuery = new HttpRequest("GET",`${environment.mongodb_api_url}getMaxProductPrice`);
    return this._http.request(maxProductPriceQuery);
  }

}
