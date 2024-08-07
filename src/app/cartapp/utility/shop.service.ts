import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  _http = inject(HttpClient);
  user:any = JSON.parse(sessionStorage.getItem("shop_user_details") as any);
  orderId:any = sessionStorage.getItem("shop_orderId");
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
  //--------------------------------------

  product_add(productId:number){
    let payload = {email: this.user.email, productId};
    return this._http.post<any>(`${environment.mongodb_api_url}addProductToOrder`,payload);
  }

  addProductToOrderedProducts(id:number, qty:number){
    let payload = {email:this.user.email, orderId:this.orderId, id, qty};
    return this._http.post<any>(`${environment.mongodb_api_url}addProductToOrderedProducts`,payload);
  }

  fetch_orderedProducts(payload:{}) {
    let payloadObj = {email:this.user.email, orderId:this.orderId, order:"inProgress", payload};
    return this._http.post<any>(`${environment.mongodb_api_url}fetch_orderedProducts`, payloadObj);
  }

  fetch_orderId() {
    let payload = {email:this.user.email};
    return this._http.post<any>(`${environment.mongodb_api_url}fetch_orderId`,payload);
  }

  cartCheckout() {
    let payloadObj = {email:this.user.email, orderId:this.orderId};
    return this._http.post<any>(`${environment.mongodb_api_url}cartCheckout`, payloadObj);
  }

  orderInit(orderId:number){
    let payloadObj = {email:this.user.email, orderId};
    return this._http.post<any>(`${environment.mongodb_api_url}orderInit`, payloadObj);
  }
}
