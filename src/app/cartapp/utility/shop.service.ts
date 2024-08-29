import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpRequest, HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  _http = inject(HttpClient);
  user:any={};
  orderId:any;
  constructor() {
    if(typeof window !== "undefined") this.user = JSON.parse(sessionStorage.getItem("shop_user_details") as any);
    if(typeof window !== "undefined") this.orderId = sessionStorage.getItem("shop_orderId");
  }

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
  filter_order(orderId:string,payload:{}) {
    let payloadObj = {email:this.user.email, orderId, order:"inProgress", payload};
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

  cartHistory(){
    let payloadObj = {email:this.user.email};
    return this._http.post<any>(`${environment.mongodb_api_url}cartHistory`, payloadObj);
  }

  //---------------- admin -----------------
  addEditProduct(pld:any){
    const {payload, files, shouldAddNewProduct} = pld;
    console.log("file to upload",files);
    let htp = new HttpHeaders();
    htp.append("Content-Type", "multipart/form-data");
    let formData = new FormData();
    if(pld.id !== undefined) formData.append('id',pld.id.toString());
    //formData.append('img',file.FileList,'wwweer');
    let addEditProductRoute = shouldAddNewProduct ? 'addNewProduct' : 'editProduct';
    console.log("addEditProductRoute",addEditProductRoute)
    if(files !== undefined) {
      for (var i = 0; i < files.length; i++) {
        formData.append('img[]', files[i], files[i].name);
      };
    }
    formData.append('name',payload?.name)
    formData.append('category',payload?.category);
    formData.append('md',payload?.md);
    formData.append('ed',payload?.ed);
    formData.append('price',payload?.price);
    formData.append('instock',payload?.instock);

    let hpr = new HttpRequest('POST',`${environment.mongodb_api_url}${addEditProductRoute}`,formData,{
      headers:htp,
      reportProgress: true,
      responseType: 'json',
      withCredentials: false,
    });
    return this._http.request(hpr)
  }

  removeProduct(id:number) {
    return this._http.delete(`${environment.mongodb_api_url}removeProduct/${id}`)
  }

  removeProductImg(payload:any) {
    return this._http.post(`${environment.mongodb_api_url}removeProductImg`,{payload})
  }

  // Download PDF
  downloadPDF(api:string) {
    let hdr = new HttpHeaders();
    //hdr.append('Content-Type','application/octet-stream');
    hdr.append('Accept', 'application/pdf');
    let req = new HttpRequest("GET",`${environment.mongodb_api_url}${api}`,{
      headers: hdr,
      responseType: 'arraybuffer',
      // responseType: 'blob' as 'json',
      reportProgress: true,
      withCredentials: false,
    });

    return this._http.request(req);

    // return this._http.get<any>(`${environment.mongodb_api_url}downloadProductsPDF`,{
    //   headers: hdr,
    //   responseType: 'blob',
    //   reportProgress: true,
    // });
  }


  // Download PDF
  downloadProductExcel(api:string) {
    let hdr = new HttpHeaders();
    hdr.append('Content-Type','application/octet-stream');
    hdr.append('Accept', 'application/pdf');
    let req = new HttpRequest("GET",`${environment.mongodb_api_url}${api}`,{
      headers: hdr,
      responseType: 'arraybuffer',
      // responseType: 'blob' as 'json',
      reportProgress: true,
      withCredentials: false,
    });

    return this._http.request(req);

    // return this._http.get<any>(`${environment.mongodb_api_url}downloadProductsPDF`,{
    //   headers: hdr,
    //   responseType: 'blob',
    //   reportProgress: true,
    // });
  }
}
