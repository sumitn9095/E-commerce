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
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

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
  cartSpecs = model<any[]>([]);
  orderId = input<string>("");
  filterQuery = output<any>();
  fetchCartOutput = output<any>();
  showReviewCartModal:boolean=false
  _router = inject(Router)

  eventProduct = output<any>({})

  categoryListDefined = input<any[]>([])
  maxProductPrice = input<number>(0);
  evt = output<any>();
  aaa = computed(() => `This is updated : ${this.detectChange()} and displayed`)
  isTrueSet : boolean = false;

  //thiscart = computed(() => this.cart());
  cartPrice = computed(() => Math.round(this.calcCartPrice()));
  totalQty = computed(() => this.cartSpecs().reduce((acc:any, item:any)=> item?.price !== undefined ? parseInt(acc + item?.qty) : acc ,0));
  gst = computed(() => Math.round(this.cartPrice() * 18) / 100);
  deliveryCharges = computed(() => this.cartPrice() > 500 ? 0 : 100);
  cartTotalPrice = computed(() => this.cartPrice() + this.gst() + this.deliveryCharges());

  constructor() {
    // --- this 'computed' updates cartCopy only initially
    this.cartCopy.set([])
    setTimeout(() => {
        //this.cartCopy.update( ()=>[...this.cartSpecs()] )
        let tempCart = this.cartSpecs().filter(k => k.qty !== 0 && k.price !== undefined)
        this.cartCopy.update(() => [...tempCart]);
        console.log("this.cartCopy",this.cartCopy())
    }, 300);

    // setTimeout(() => {
    //     this.cartCopy.update( ()=>[...this._cart.cart()] )
    // }, 300);

    effect(()=>{
      //console.log("this.cart()------",this.cart())
      console.log("this.categoryListDefined",this.categoryListDefined())
      console.log("maxProductPrice",this.maxProductPrice())
      this.isTrueSet = (!this.detectChange());
      console.log("this.isTrueSet",this.isTrueSet);
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
    return this.cartSpecs().reduce((acc:any, item:any) => {
      let totalIndividualProductPrice:number=0;
      if(item?.price !== undefined) totalIndividualProductPrice = item?.qty * parseInt(item?.price);
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
    this.filterQuery.emit(payload)
  }

  reviewCart(){
    // --- this 'computed' updates cartCopy only initially
    // this.cartCopy.set([])
    // setTimeout(() => {
        // this.cartCopy.update( () => {
        //     return this.cartSpecs().map((r:any)=>{
        //       [...this.cartSpecs()]
        //     }
        //   )
        // })
      let tempCart = this.cartSpecs().filter(k => k.qty !== 0 && k.price !== undefined)
      this.cartCopy.update(() => [...tempCart]);

    //}, 300);

    console.log("this.cartCopy",this.cartCopy())
    this.showReviewCartModal = true;
  }

  checkout() {
    this._shop.cartCheckout().subscribe({
      next:(response)=>{
        if(response.response.acknowledged) {
          this.fetchCartOutput.emit("checkout completed");
          this._router.navigate(['../shopping-with-db'])
        }
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

    this.cartSpecs.update(prev => prev.map((c:any)=>{
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
        this.cartCopy.update( ()=>[...this.cartSpecs()] )
    }, 300);
    
    this._shop.addProductToOrderedProducts(product.id, product.qty).subscribe({
      next: (product2)=>console.log("Updated Product >> ",product),
      error: (err)=>{throw new Error(err)}
    })
    console.log("this._cart.cart ------ this.cartCopy",this._cart.cart(), this.cartCopy());


  }

  eventProductF = (data:any) => this.eventProduct.emit({type:'cart',downloadType:data});
  
  // processDownloadProductPDF(){
  //   this._shop.downloadPDF('downloadPDF').subscribe({
  //     next: (event:any) => {

  //     //  console.log("event",event)
  //     // // const jsonString = JSON.stringify(event);
  //     //  let blob = new Blob([event.body], {type: "application/pdf"})
  //     //   saveAs(blob,`products3.pdf`);

  //       if (event.type == HttpEventType.Sent) {
  //         console.log("upload started - ")
  //       } else if(event.type == HttpEventType.DownloadProgress) {
  //         let progress = (100 * event.loaded) / event.total;
  //         console.log("upload progress - ", progress);
  //       } else if(event instanceof HttpResponse) {
  //         console.log("upload completed - ",event.body);
  //         // let binaryData = [];
  //         //   binaryData.push(event.body);
  //         // let llop = new Uint8Array(event.body, 0, event.body.byteLength)
  //         //  let kkj = event.body['[Uint8Array]'];
  //         let buffer:BlobPart[] = [event.body];

  //         //var uint8View = new Uint8Array([event.body]);
          
  //         /////let blob = new Blob(buffer, { type: "application/octet-stream" });
  //         //var file = new File([event.body], "MyTasks", {type: 'application/pdf'});
  //         var file = new File([event.body], "", {type: 'text/plain'});
  //         // const blob = new Blob([event.body], {
  //         //   type: 'application/pdf',
  //         // });
  //         console.log("processDownloadProductPDF-blob",file)

  //         saveAs(file,"Products.txt");
  //         //const blob = new Blob([response.data], {type: 'application/pdf'})
  //         // const link = document.createElement('a')
  //         // link.href = window.URL.createObjectURL(blob)
  //         // link.download = `your-file-name.pdf`
  //         // link.click()

  //       }
  //     },
  //     error: (err:Error)=>console.error(err)
  //   })
  // }

  // processDownloadProductExcel(){
  //   this._shop.downloadProductExcel('downloadProductExcel',this.filterFormValue).subscribe({
  //     next: (event:any) => {
  //       if (event.type == HttpEventType.Sent) {
  //         console.log("upload started - ")
  //       } else if(event.type == HttpEventType.DownloadProgress) {
  //         let progress = (100 * event.loaded) / event.total;
  //         console.log("download progress - ", progress);
  //       } else if(event instanceof HttpResponse) {
  //         console.log("upload completed - ",event.body);
  //         var file = new File([event.body], "MyTasks", {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  //         saveAs(file);
  //       }
  //     },
  //     error: (err:Error)=>console.error(err)
  //   })
  // }
}