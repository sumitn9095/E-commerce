import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpRequest, HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { CommonConstants } from './CommonConstants';
import { BehaviorSubject, Observable } from 'rxjs';
import moment, { Moment } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  _http = inject(HttpClient);
  user:any=CommonConstants?.user();
  orderId:any=CommonConstants?.orderId();
  stateBs = new BehaviorSubject<any>('')
  constructor() {
    //if(typeof window !== "undefined") this.user = JSON.parse(sessionStorage.getItem("shop_user_details") as any);
    //if(typeof window !== "undefined") this.orderId = sessionStorage.getItem("shop_orderId");
    //console.log("user",this.user)
  }

  printApiState(state:any) {
      this.stateBs.next(state);
      // this.errorBs.subscribe((data) => {
      //     console.log('my error state', data);
      // });
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
  //--------------------------  --------------------------

  product_add(productId:number){
    let payload = {email: this.user?.email, productId};
    return this._http.post<any>(`${environment.mongodb_api_url}addProductToOrder`,payload);
  }

  addProductToOrderedProducts(id:number, qty:number){
    let payload = {email:this.user?.email, orderId:this.orderId, id, qty};
    return this._http.post<any>(`${environment.mongodb_api_url}addProductToOrderedProducts`,payload);
  }

  fetch_orderedProducts(payload:any) {
    //CommonConstants.userAsPromise()
    ///CommonConstants.userAsPromise().then(user => {
    let useremail = this.user?.email;
    let userOrderId = this.orderId;
    let payloadObj = {email: useremail, orderId:userOrderId, order:"inProgress", payload};
    return this._http.post<any>(`${environment.mongodb_api_url}fetch_orderedProducts`, payloadObj);
    //})
  }
  filter_order(orderId:string,payload:{}) {
    let payloadObj = {email:this.user?.email, orderId, order:"inProgress", payload};
    return this._http.post<any>(`${environment.mongodb_api_url}fetch_orderedProducts`, payloadObj);
  }

  fetch_orderId() {
    let payload = {email:this.user?.email};
    return this._http.post<any>(`${environment.mongodb_api_url}fetch_orderId`,payload);
  }

  cartCheckout() {
    let payloadObj = {email:this.user?.email, orderId:this.orderId};
    return this._http.post<any>(`${environment.mongodb_api_url}cartCheckout`, payloadObj);
  }

  orderInit(orderId:number){
    let payloadObj = {email:this.user?.email, orderId};
    return this._http.post<any>(`${environment.mongodb_api_url}orderInit`, payloadObj);
  }

  cartHistory(){
    let payloadObj = {email:this.user?.email};
    return this._http.post<any>(`${environment.mongodb_api_url}cartHistory`, payloadObj);
  }

  //---------------- admin -----------------
  addEditProduct(pld:any) {
    const {payload, files, shouldAddNewProduct} = pld;
    console.log("addEditProduct",pld);
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
    //let md1 = moment(payload?.md).format('DD-MM-YYYY');
    let md2 = moment(payload?.md).toISOString()
    //let ed1 = moment(payload?.ed).format('DD-MM-YYYY');
    let ed2 = moment(payload?.ed).toISOString()
    formData.append('name',payload?.name);
    formData.append('email',this.user?.email);
    formData.append('category',payload?.category);
    formData.append('md',md2);
    formData.append('ed',ed2);
    formData.append('price',payload?.price);
    formData.append('instock',payload?.instock);

    let hpr = new HttpRequest('POST',`${environment.mongodb_api_url}${addEditProductRoute}`,formData, {
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
  downloadPDF() {
    let hdr = new HttpHeaders();
    //hdr.append('Content-Type','application/octet-stream');
    hdr.append('Accept', 'application/pdf');
    let req = new HttpRequest("GET",`${environment.mongodb_api_url}downloadPDF`,{
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
  downloadProductExcel(payload:{}) {
    let hdr = new HttpHeaders();
    hdr.append('Content-Type','application/octet-stream');
    //hdr.append('Accept', 'application/pdf');
    let req = new HttpRequest("POST",`${environment.mongodb_api_url}downloadProductExcel`, payload,{
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

  uploadProducts(file:any,replace:boolean): Observable<any> {
    let hdr = new HttpHeaders();
    hdr.append('Content-type', 'multipart/form-data');
    const form = new FormData();
    if(file) form.append('productexcel', file, file.name);
    form.append('email',this.user?.email);
    form.append('replace',replace ? 'replace' : 'append');
    if(this.user?.admin) form.append('admin', this.user?.admin);
    //return this._http.post<any>(`${environment.mongodb_api_url}`, form, {headers: hdr});
    var req = new HttpRequest('POST',`${environment.mongodb_api_url}uploadProductExcel`,form,
      {
          headers: hdr,
          responseType: 'json',
          // responseType: 'blob' as 'json',
          reportProgress: true,
          withCredentials: false,
      }
    );
    return this._http.request(req);
  }


  //------------------- category / product --
    fetchProduct(id:number) {
      return this._http.get(`${environment.mongodb_api_url}fetchProduct/${id}`)
    }
}
