import { ChangeDetectionStrategy, Component, computed, inject, Input, input, model, OnInit, Signal, signal, SimpleChanges, WritableSignal, effect, output } from '@angular/core';
import { CartService } from '../../utility/cart.service';
import { SidebarModule } from 'primeng/sidebar';
import { DataViewModule } from 'primeng/dataview';
import { ProductDisplayBigComponent } from '../product-display-big/product-display-big.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ProductDisplayBigDbComponent } from "../product-display-big-db/product-display-big-db.component";
import { ShopService } from '../../utility/shop.service';
import { ShoppingFiltersComponent } from '../shopping-filters/shopping-filters.component';
import { HttpResponse } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidecart',
  standalone: true,
  imports: [SidebarModule, DataViewModule, ProductDisplayBigComponent, AsyncPipe, ProductDisplayBigDbComponent, ShoppingFiltersComponent, DialogModule, ButtonModule],
  providers: [],
  templateUrl: './sidecart.component.html',
  styleUrl: './sidecart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SidecartComponent implements OnInit {
  _shop = inject(ShopService)
  _cart = inject(CartService);
  detectChange = input(false);
  cart = model<any[]>([]);
  cartCopy:WritableSignal<any> = signal([]);
  orderId = input<string>("");
  filterQuery = output<any>();
  fetchCartOutput = output<any>();
  showReviewCartModal:boolean=false

  categoryListDefined = input<any[]>([])
  maxProductPrice = input<number>(0);
  evt = output<any>();
  aaa = computed(() => `This is updated : ${this.detectChange()} and displayed`)
  isTrueSet : boolean = false;

  //thiscart = computed(() => this.cart());
  cartPrice = computed(() => Math.round(this.calcCartPrice()));
  totalQty = computed(() => this.cart().reduce((acc:any, item:any)=> parseInt(acc + item?.qty),0));
  gst = computed(() => Math.round(this.cartPrice() * 18) / 100);
  deliveryCharges = computed(() => this.cartPrice() > 500 ? 0 : 100);
  cartTotalPrice = computed(() => this.cartPrice() + this.gst() + this.deliveryCharges());

  constructor() {
    // --- this 'computed' updates cartCopy only initially
    this.cartCopy.set([])
    setTimeout(() => {
      this.cartCopy.update(()=>[...this.cart()]);
    }, 500);

    // setTimeout(() => {
    //     this.cartCopy.update( ()=>[...this._cart.cart()] )
    // }, 300);

    effect(()=>{
      //console.log("this.cart()------",this.cart())
      console.log("this.categoryListDefined",this.categoryListDefined())
      console.log("maxProductPrice",this.maxProductPrice())
      this.isTrueSet = (!this.detectChange());
    })
  }

  ngOnInit(): void {
    //console.log("ddd",this.ddd());
    //this.shouldOpenSideCart.set(d => d);
    //console.log("shouldOpenSideCart", this.shouldOpenSideCart())

    // this.uuu = this._cart.sideCartOpen;

    // this._cart.sideCartOpen.subscribe({
    //   next: (d:any)=> {
    //     console.log("sideCartOpen > ",d);
    //     //this.rrr = d;
    //   }
    // })
  }

  calcCartPrice = () => {
    return this.cart().reduce((acc:any, item:any) => {
      let totalIndividualProductPrice:number = item?.qty * parseInt(item?.price);
      return parseInt(acc + totalIndividualProductPrice);
    },0);
  }

  // calcCartDetails = () => {
  //   let getCalcCartPrice = this.calcCartPrice();
  //   console.log("cart--Price--Update",getCalcCartPrice);
  //   this._cart.cartPrice.update(computed(() => getCalcCartPrice));
  //   this._cart.totalQty.update(computed(() => this.cart().reduce((acc:any, item:any)=> parseInt(acc + item?.qty),0)));
  //   this._cart.gst.update( computed(() => Math.round(this._cart.cartPrice() * 18) / 100) );
  //   this._cart.deliveryCharges.update( computed(() => this._cart.cartPrice() > 500 ? 0 : 100));
  //   this._cart.cartTotalPrice.update( computed(() => this._cart.cartPrice() + this._cart.gst() + this._cart.deliveryCharges()));
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log("SimpleChanges",changes)
  // }

  filterProducts(payload:{}) {
    this.filterQuery.emit(payload);
  }

  reviewCart(){
    //this.cart.update(()=>[...this._cart.cart()] )
    console.log("this.cart",this.cart())
    this.showReviewCartModal = true;
  }

  checkout(){
    this._shop.cartCheckout().subscribe({
      next:(response)=>{
        //---
        this.fetchCartOutput.emit("checkout completed");
      },
      error:()=>{
        //---
      }
    })
  }

  updateCart(product:any) {
    
    this._cart.cart.update(prev => prev.map((c:any)=>{
      if(c.id === product.id) c.qty = product.qty
      return c;
    }));
    
    //  let cart_temp:any = [];
    // cart_temp = this._cart.cart();
    // this.cart.set([]);
    //   setTimeout(() => {
    //       this.cart.update(() => [...cart_temp]);
    //       //console.log("this.thisCart",this.thisCart(), this._cart.cart());
    //   },100)

    // --- this 'computed' updates cartCopy, when this func is called, eachtime
    this.cartCopy.set([])
    setTimeout(() => {
        this.cartCopy.update( ()=>[...this._cart.cart()] )
    }, 300);
    
    this._shop.addProductToOrderedProducts(product.id, product.qty).subscribe({
      next: (product2)=>console.log("Updated Product >> ",product),
      error: (err)=>{throw new Error(err)}
    })
    console.log("this._cart.cart ------ this.cartCopy",this._cart.cart(), this.cartCopy());


  }
  
}