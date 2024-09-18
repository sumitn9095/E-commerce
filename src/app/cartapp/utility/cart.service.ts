import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public varSideCart: boolean = false;

  //--

  public registrationStep:number = 1;
  public isShoppingPage:boolean = false;

  // ---- Cart related Signals ----
  public totalQty = signal('0');
  public cartPrice: any = signal('0')
  public gst = signal(0);
  public deliveryCharges = signal(0);
  public cartTotalPrice = signal(0);
  public cart: WritableSignal<any> = signal<any>([])
  public temp_cart: WritableSignal<any> = signal<any>([])

  public firstName:WritableSignal<any> = signal<any>('First Name');
  public lastName:WritableSignal<any> = signal<any>('Last Name');
  public birthDate:WritableSignal<any> = signal(Date());


  onDetectChangeSideCart : WritableSignal<boolean> = signal(true);

  constructor() { }

  toggleSideCartPanel(){
    // this.onDetectChange.set(Math.random()*4);
    this.onDetectChangeSideCart.update(v => true);
    this.temp_cart.update(()=>this.cart());
    this.cart.update(computed(()=>this.temp_cart()));
  }

  openSideCartPanel(){
    // this.onDetectChange.set(Math.random()*4);
    this.onDetectChangeSideCart.update(v => false);
    setTimeout(() => {
      this.onDetectChangeSideCart.update(v => true);
       this.temp_cart.update(()=>this.cart());
      this.cart.update(computed(()=>this.temp_cart()));
    }, 400);
   
  }
  closeSideCartPanel(){
    // this.onDetectChange.set(Math.random()*4);
    this.onDetectChangeSideCart.update(v => false);
    this.temp_cart.update(()=>this.cart());
    this.cart.update(computed(()=>this.temp_cart()));
  }

}
